import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractChunkData } from '@src/core/types/types'
import { EmbeddingService } from '@src/modules/embeddinng/service/embedding.service'
import { VectorRepository } from '@src/modules/knowledge-base/data/vector.repository'
import { ChatCompletionsHf } from '@src/modules/queryClassification/types/types'
import { Message } from '@src/modules/thread/data/thread.schema'
import axios, { AxiosInstance } from 'axios'

@Injectable()
export class QueryClassificationService {
	private _hfApi: AxiosInstance
	private readonly baseUrl = 'https://api-inference.huggingface.co'

	constructor(
		private readonly configService: ConfigService,
		private readonly vectorRepo: VectorRepository,
		private readonly embed: EmbeddingService
	) {
		const hfApiKey = this.configService.get<string>('hfApiKey')
		this._hfApi = axios.create({
			baseURL: this.baseUrl,
			headers: {
				Authorization: `Bearer ${hfApiKey}`,
				'Content-Type': 'application/json',
			},
		})
	}

	async processQuery(text: string, orgId: string) {
		try {
			const needContext = await this.needContext(text)

			if (!needContext) return ''

			const similarSentences = await this.generateQueries(text)
			let contexts: ExtractChunkData[] = []

			for (const sentence of similarSentences) {
				const embedding = await this.embed.embedQuery(sentence)

				const result = await this.vectorRepo.similaritySearch(embedding, orgId)
				contexts = [...contexts, ...result]
			}

			const cleared = this.uniqByKeepFirst(contexts)

			const rerankedScores = await this.rerank({
				sentences: cleared.map((item) => item.pageContent),
				source_sentence: text,
			})

			const rerankedContexts = cleared.map((context, index) => ({
				...context,
				score: rerankedScores[index],
			}))

			return rerankedContexts
		} catch (error) {
			return 'error'
		}
	}

	private async generateQueries(text: string): Promise<string[]> {
		const body: ChatCompletionsHf = {
			max_tokens: 512,
			messages: [
				{ role: 'system', content: this.generateQueriesInstruction() },
				new Message({ content: text, role: 'user' }),
			],
			temperature: 0.1,
			top_p: 0.7,
		}
		try {
			const response = await this._hfApi.post('/models/microsoft/Phi-3-mini-4k-instruct/v1/chat/completions', body)
			return JSON.parse(response.data.choices[0].message.content).queries
		} catch (error) {
			console.error('Error in generateQueries:', error)
			throw new Error('Failed to generate queries')
		}
	}

	private async rerank(body: { sentences: string[]; source_sentence: string }) {
		try {
			const response = await this._hfApi.post('/models/sentence-transformers/all-MiniLM-L6-v2', body)
			return response.data
		} catch (error) {
			console.error('Error in on classification:', error)
			throw new Error('Failed to classify')
		}
	}

	private async needContext(text: string) {
		const body: ChatCompletionsHf = {
			max_tokens: 512,
			messages: [
				{ role: 'system', content: this.generateClassificationInstruction() },
				new Message({ content: text, role: 'user' }),
			],
			temperature: 0.1,
			top_p: 0.1,
			response_format: {
				type: 'json',
				value: JSON.stringify({
					type: 'object',
					properties: {
						shouldRetrieve: { type: 'boolean' },
					},
					required: ['shouldRetrieve'],
				}),
			},
		}
		try {
			const response = await this._hfApi.post('/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions', body)
			return JSON.parse(response.data.choices[0].message.content).shouldRetrieve
		} catch (error) {
			console.error('Error in generateQueries:', error)
			return true
		}
	}

	private generateQueriesInstruction() {
		return 'Reescreva a frase a seguir, preservando o mesmo significado, mas usando palavras e expressões diferentes. Use linguagem natural com um tom fluente e conversacional e mantenha a frase afirmativa em terceira pessoa. Não substitua ou modifique nenhum nome próprio (como nomes de marcas, lugares ou pessoas); mantenha-os exatamente como aparecem no texto original. Use o mesmo idioma da frase original. Gere 3 novas frases. Retorne {queries: string[]}'
	}

	private generateClassificationInstruction() {
		return 'Classify the query as either needing context or being a common conversation, such as greetings or small talk. {"shouldRetrieve": "boolean"}'
	}

	private uniqByKeepFirst(a: ExtractChunkData[]) {
		const seen: ExtractChunkData[] = []
		for (const item of a) {
			const k = String(item._id)

			seen.some((item) => String(item._id) === k) ? false : seen.push(item)
		}

		return seen
	}
}
