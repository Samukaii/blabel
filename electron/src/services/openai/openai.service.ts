import { ZodObject } from 'zod';
import { zodTextFormat } from "openai/helpers/zod";
import { openAiClient } from '../../core/open-ai-client.js';
import { AiMessage } from '../../models/ai-message.js';

const structuredOutput = async <T extends Record<string, any>>(messages: AiMessage[], schema: ZodObject<T>) => {
	const response = await openAiClient().responses.parse({
		model: 'gpt-4o-mini',
		input: messages,
		text: {
			format: zodTextFormat(schema, 'result')
		}
	});

	return response.output_parsed as T;
}

export const openAiService = {
	structuredOutput
};
