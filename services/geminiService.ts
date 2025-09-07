import { GoogleGenAI } from "@google/genai";
import { Agent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function callGeminiApi(
    agent: Pick<Agent, 'name' | 'systemPrompt'>, 
    prompt: string, 
    context: string, 
    isJson: boolean = false
): Promise<string> {
  const fullPrompt = `${prompt}\n\n## Project Context:\n${context}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: agent.systemPrompt,
        responseMimeType: isJson ? "application/json" : "text/plain",
        temperature: 0.7,
        topP: 0.95,
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error('Received an empty response from the API.');
    }
    
    return text;

  } catch (error) {
    console.error(`Error processing agent task for ${agent.name}:`, error);
    if (error instanceof Error) {
        // Attempt to parse Google specific error messages if available
        const googleError = (error as any).error;
        if (googleError && googleError.message) {
            throw new Error(`Gemini API Error: ${googleError.message}`);
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the Gemini API.');
  }
};
