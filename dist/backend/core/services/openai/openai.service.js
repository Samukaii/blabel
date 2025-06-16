import { openAiClient } from '../../open-ai-client.js';
import { zodTextFormat } from "openai/helpers/zod";
const structuredOutput = async (messages, schema) => {
    const response = await openAiClient().responses.parse({
        model: 'gpt-4.1-nano',
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
