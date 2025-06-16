import OpenAI from "openai";

let openai: OpenAI;

export const openAiClient = () => {
	if (openai) return openai;

	openai = new OpenAI({
		apiKey: process.env["OPENAI_API_KEY"]
	});

	return openai;
};
