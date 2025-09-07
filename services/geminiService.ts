import { GoogleGenAI } from "@google/genai";
import { Agent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeminiApiOptions {
  isJson?: boolean;
  disableThinking?: boolean;
}

// Define a type for the configuration to avoid using 'any'
interface GeminiGenerateContentConfig {
  systemInstruction: string;
  responseMimeType: "application/json" | "text/plain";
  temperature: number;
  topP: number;
  thinkingConfig?: { thinkingBudget: number };
}


export async function callGeminiApi(
    agent: Pick<Agent, 'name' | 'systemPrompt' | 'model'>, 
    prompt: string, 
    context: string, 
    options: GeminiApiOptions = {}
): Promise<string> {
  const { isJson = false, disableThinking = false } = options;
  const fullPrompt = `${prompt}\n\n## Project Context:\n${context}`;
  
  const config: GeminiGenerateContentConfig = {
    systemInstruction: agent.systemPrompt,
    responseMimeType: isJson ? "application/json" : "text/plain",
    temperature: 0.7,
    topP: 0.95,
  };

  if (disableThinking && agent.model === 'gemini-2.5-flash') {
    config.thinkingConfig = { thinkingBudget: 0 };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: agent.model,
      contents: fullPrompt,
      config: config
    });

    const text = response.text;
    if (!text) {
        throw new Error(`Agent ${agent.name} returned an empty response.`);
    }
    
    return text.trim();

  } catch (error: unknown) {
    console.error(`Error in callGeminiApi for agent ${agent.name}:`, error);
    if (error instanceof Error) {
        // Attempt to find a more specific error message from Google's error structure
        const gError = error as any;
        if (gError.cause?.error?.message) {
             throw new Error(`API Error from ${agent.name}: ${gError.cause.error.message}`);
        }
        // Fallback to the standard error message
        throw new Error(`API Error from ${agent.name}: ${error.message}`);
    }
    throw new Error(`An unknown API error occurred with agent ${agent.name}.`);
  }
};