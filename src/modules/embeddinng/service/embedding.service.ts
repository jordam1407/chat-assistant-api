import { Injectable } from '@nestjs/common'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ConfigService } from '@nestjs/config' // To manage configuration

@Injectable()
export class EmbeddingService {
	private model: OpenAIEmbeddings

	constructor(private readonly configService: ConfigService) {
		this.model = new OpenAIEmbeddings({
			modelName: 'text-embedding-3-small',
			apiKey: this.configService.get('openaiApiKey'),
		})
	}

	async getDimensions(): Promise<number> {
		return 1536
	}

	async embedDocuments(texts: string[]): Promise<number[][]> {
		return this.model.embedDocuments(texts)
	}

	async embedQuery(text: string): Promise<number[]> {
		return this.model.embedQuery(text)
	}
}
