type MessageContent =
	| string
	| {
			text: string
			type: 'text'
	  }[]
	| {
			image_url: { url: string }
			type: 'image_url'
	  }

type ResponseFormat = { type: 'json'; value: string } | { type: 'regex'; value: string }

type ToolChoice = { function: { name: string } } | string | undefined

interface Tool {
	function: {
		arguments: unknown
		description: string
		name: string
	}
	type: string
}

interface StreamOptions {
	include_usage: boolean
}

export interface ChatCompletionsHf {
	frequency_penalty?: number // between -2.0 and 2.0
	logprobs?: boolean
	max_tokens?: number
	messages: {
		content: MessageContent
		name?: string
		role: string
	}[]
	presence_penalty?: number // between -2.0 and 2.0
	response_format?: ResponseFormat
	seed?: number
	stop?: string[]
	stream?: boolean
	stream_options?: StreamOptions
	temperature?: number // between 0 and 2
	tool_choice?: ToolChoice
	tool_prompt?: string
	tools?: Tool[]
	top_logprobs?: number // between 0 and 5, requires logprobs to be true
	top_p?: number // between 0 and 1
}
