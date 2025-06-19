import OpenAI from "openai";

let openai: OpenAI;

export const aiIntegrationKey = () => {
	return process.env["OPENAI_API_KEY"];
}

export const openAiClient = () => {
	if (openai) return openai;

	const apiKey = aiIntegrationKey();

	if(!apiKey) throw new Error(
		"OPENAI_API_KEY not found. Please set it in your environment variables."
	);

	openai = new OpenAI({apiKey});

	return openai;
};
