import { GoogleGenAI, Type } from "@google/genai";
import { StyleDNA, Variant } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const variantsResponseSchema = {
    type: Type.OBJECT,
    properties: {
        variants: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    style: { type: Type.STRING },
                    novelty: { type: Type.NUMBER },
                    accessibility_score: { type: Type.NUMBER },
                    preview: { type: Type.STRING },
                    code: { type: Type.STRING },
                    dependencies: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                },
                required: ['id', 'name', 'preview', 'code']
            }
        }
    }
};

const singleVariantResponseSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        style: { type: Type.STRING },
        novelty: { type: Type.NUMBER },
        accessibility_score: { type: Type.NUMBER },
        preview: { type: Type.STRING },
        code: { type: Type.STRING },
        dependencies: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
    },
    required: ['id', 'name', 'preview', 'code']
};


const generatePrompt = (prompt: string, styleDna: StyleDNA) => `
  **Objective:** Generate 4 unique, production-ready UI component variants based on the user's prompt and selected Style DNA.

  **User Prompt:** "${prompt}"

  **Style DNA:**
  - Name: ${styleDna.name}
  - Keywords: ${styleDna.keywords}

  **Agent Instructions:**
  1.  **Design Architect:** Brainstorm 4 distinct structural and layout variations for the component.
  2.  **Aesthetic Curator:** Apply the "${styleDna.name}" style to each variant, using the keywords as inspiration. Ensure visual distinction between variants.
  3.  **Code Synthesis Engine:**
      - Write clean, modern React code using functional components and hooks.
      - Use Tailwind CSS for all styling. Do NOT use inline styles.
      - Create a self-contained component. All necessary HTML and styling must be included.
      - For the 'preview', provide the complete HTML output of the component, including a root div and any necessary Tailwind classes for it to render correctly on a plain white background.
      - For the 'code', provide the complete React component as a string.
  4.  **QA & Metrics Agents:** Assign a novelty score (0.1-1.0) and an estimated accessibility score (1-100) for each variant. List any required npm dependencies (e.g., 'framer-motion', 'lucide-react').
  5.  **ID Generation**: Generate a unique short ID for each variant (e.g., 'v1_xyz').

  **Output Format:** Your response MUST be a valid JSON object matching the specified schema.
`;

const refinePrompt = (refinementRequest: string, styleDna: StyleDNA, currentVariant: Variant) => `
    **Objective:** Refine an existing UI component based on user feedback.

    **Style DNA (to maintain):**
    - Name: ${styleDna.name}
    - Keywords: ${styleDna.keywords}

    **Current Component Code:**
    \`\`\`jsx
    ${currentVariant.code}
    \`\`\`

    **User Refinement Request:** "${refinementRequest}"

    **Agent Instructions:**
    1.  **Code Synthesis Engine:** Modify the provided React component code to incorporate the user's feedback.
    2.  **Maintain Consistency:** Ensure the refined component adheres to the original Style DNA.
    3.  **Update Preview:** Generate the new HTML 'preview' for the updated component.
    4.  **Preserve ID:** The 'id' of the variant MUST remain "${currentVariant.id}".
    5.  **Re-evaluate Metrics:** Recalculate novelty and accessibility scores if the changes are significant.

    **Output Format:** Your response MUST be a single, valid JSON object matching the specified schema for one variant.
`;

async function callApi<T>(prompt: string, schema: object): Promise<T> {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
                topP: 0.9,
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }

        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during generation.";
        throw new Error(`API call failed: ${errorMessage}`);
    }
}


export async function generateUiVariants(prompt: string, styleDna: StyleDNA): Promise<Variant[]> {
    const fullPrompt = generatePrompt(prompt, styleDna);
    const result = await callApi<{ variants: Variant[] }>(fullPrompt, variantsResponseSchema);
    
    if (!result.variants || !Array.isArray(result.variants)) {
        throw new Error("API returned an invalid or empty variants array.");
    }
    return result.variants;
}

export async function refineUiVariant(refinementRequest: string, styleDna: StyleDNA, currentVariant: Variant): Promise<Variant> {
    const fullPrompt = refinePrompt(refinementRequest, styleDna, currentVariant);
    const result = await callApi<Variant>(fullPrompt, singleVariantResponseSchema);

    if (!result || !result.id) {
         throw new Error("API returned an invalid variant object for refinement.");
    }
    return result;
}
