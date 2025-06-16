import { zodTextFormat } from "openai/helpers/zod";
import { openAiClient } from '../../core/open-ai-client.js';
const structuredOutput = async (messages, schema) => {
    const response = await openAiClient().responses.parse({
        model: 'gpt-4o-mini',
        input: messages,
        text: {
            format: zodTextFormat(schema, 'result')
        }
    });
    return response.output_parsed;
};
export const openAiService = {
    structuredOutput
};
