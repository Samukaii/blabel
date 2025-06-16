import { ZodObject, infer as zodInfer } from 'zod';
import { openAiClient } from '../../open-ai-client.js';
import { zodTextFormat } from "openai/helpers/zod";
import { AiMessage } from '../../../models/ai-message.js';

const structuredOutput = async <T extends Record<string, any>>(messages: AiMessage[], schema: ZodObject<T>) => {
	const response = await openAiClient().responses.parse({
		model: 'gpt-4.1-nano',
		input: messages,
		text: {
			format: zodTextFormat(schema, 'result')
		}
	});

	return response.output_parsed as zodInfer<typeof schema>;
}

export const openAiService = {
	structuredOutput
};
