import { GoogleGenAI } from "@google/genai";
import { AgentRole, WorkflowLog } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForAgent = (
  role: AgentRole, 
  userPrompt: string, 
  previousLogs: WorkflowLog[],
  generatedCode: string
): string => {
  const context = previousLogs.map(log => `${log.agentRole}: ${log.message}`).join('\n');

  switch (role) {
    case AgentRole.CEO:
      return `You are Orion, the CEO of a software company. A client wants to build: "${userPrompt}". 
      Your task is to respond to the team with a high-level project plan. 
      Outline the key features and the main goal of the application in a concise summary.
      Do not mention the tech stack or implementation details.
      Keep your response concise and focused on the business goals.`;
      
    case AgentRole.CTO:
      return `You are Lyra, the CTO. The CEO, Orion, has laid out a plan. Based on that plan, your task is to create a technical specification for the team.
      Start your response with a brief acknowledgement of the CEO's plan.
      The tech stack must be React with TypeScript and Tailwind CSS.
      Outline the file structure and the main components needed. Be specific about component responsibilities.
      Previous context:
      ${context}`;

    case AgentRole.SENIOR_ENGINEER:
      return `You are Leo, a Senior React Engineer. The CTO, Lyra, has provided a technical specification. Your task is to write the code for the main application component.
      Start your response by acknowledging Lyra's spec.
      The code must be a single, complete, and functional React component in a file named App.tsx.
      Use React Hooks (useState, useEffect, etc.), TypeScript for typing, and Tailwind CSS for styling.
      Do not include imports for other local components as you are only writing one file. Do not include setup files like index.html or index.tsx.
      The code should be clean, well-commented, and directly address the user's initial request.
      Do not wrap the code in markdown backticks. Just provide the raw code.
      Previous context:
      ${context}`;

    case AgentRole.JUNIOR_ENGINEER:
      return `You are Cygnus, a Junior Engineer. Your task is to review the code written by the Senior Engineer, Leo.
      Start your review with a brief, positive acknowledgement.
      Provide a constructive code review summary. Mention one thing that is done well and one potential improvement.
      Do not suggest rewriting the whole code. Keep it brief and helpful.
      Previous context:
      ${context}
      
      Code to review:
      \`\`\`tsx
      ${generatedCode}
      \`\`\``;

    case AgentRole.DEVOPS:
      return `You are Aquila, a DevOps Engineer. The code has been written and reviewed. The project is ready for deployment.
      Acknowledge the team's work.
      Provide a concise summary of the deployment steps for this React application.
      Assume the user has Node.js and npm installed.
      Focus on building the project and suggesting a hosting platform.
      Previous context:
      ${context}`;
      
    default:
      throw new Error(`No prompt configured for agent role: ${role}`);
  }
};

export async function* runAgentTaskStream(
  role: AgentRole,
  userPrompt: string,
  previousLogs: WorkflowLog[],
  generatedCode: string
): AsyncGenerator<string> {
  try {
    const prompt = getPromptForAgent(role, userPrompt, previousLogs, generatedCode);
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    for await (const chunk of responseStream) {
        if (chunk.text) {
            yield chunk.text;
        }
    }

  } catch (error) {
    console.error(`Error processing agent task for ${role}:`, error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the Gemini API.');
  }
};