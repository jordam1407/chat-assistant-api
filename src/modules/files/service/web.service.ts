import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer'
import { Logger } from '@nestjs/common'
import { cleanString } from '@src/modules/files/util/string'
import { convert } from 'html-to-text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { Browser, Page } from 'puppeteer'

const myEvaluateFunction: (page: Page, browser: Browser) => Promise<string> = async (page) => {
	// Use the `evaluate` method on the page to extract data
	await page.click('#lnk-13')

	// Wait for the page to finish loading after the click
	await page.waitForNavigation({ waitUntil: 'networkidle0' })

	const pageContent = await page.evaluate(async () => {
		// Click on the element with id="lnk-13"

		// Example: Extract the text content of the entire body, excluding scripts and styles
		return document.body.innerHTML || 'No content available'
	})

	// Optionally, log the extracted content
	Logger.debug('Extracted Content:', pageContent)

	return pageContent
}

export class WebLoaderService {
	async getUnfilteredChunks({
		webUrl,
		chunkSize = 1800,
		chunkOverlap = 200,
	}: {
		webUrl: string
		chunkSize?: number
		chunkOverlap?: number
	}) {
		const chunker = new RecursiveCharacterTextSplitter({
			chunkSize: chunkSize,
			chunkOverlap: chunkOverlap,
			separators: ['\n\n'],
		})

		const loader = new PuppeteerWebBaseLoader(webUrl, {
			evaluate: myEvaluateFunction,
			gotoOptions: { waitUntil: 'networkidle0' },
		})
		const data = await loader.load()
		const text = convert(data[0].pageContent, {
			preserveNewlines: true,
		})
		Logger.debug(text)

		const chunks = await chunker.splitText(text)
		const cleanedChunks = chunks.map((chunk) => cleanString(chunk))

		return cleanedChunks.filter((chunk) => !chunk.includes('JavaScript'))
	}
}
