import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnalysisRequest, AnalysisResponse } from "../types";
import { SYSTEM_PROMPT, REVISION_PROMPT } from "../constants";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY or allow via environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeResearch = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const ai = getAIClient();
  const currentDate = new Date().toISOString();

  // Prepare file parts
  const fileParts = await Promise.all(request.files.map(fileToGenerativePart));

  const textPrompt = `
    CURRENT SYSTEM DATE: ${currentDate}
    GOAL: ${request.goal}
    FIELD OF STUDY: ${request.field}
    
    USER HYPOTHESIS / INPUT:
    ${request.hypothesis}
    
    INSTRUCTIONS:
    Analyze the above input according to the system instructions. 
    If files are attached, prioritize their content as "Evidence".
  `;

  // Combine parts
  const contents = [
    { text: textPrompt },
    ...fileParts
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3, // Low temperature for academic rigor
      },
      contents: contents.map(part => 'text' in part ? { text: part.text } : part) as any, // Cast to handle the mix
    });

    return {
      markdown: response.text || "No response generated.",
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze research. Please check API key and try again.");
  }
};

export const generateRevisionChecklist = async (originalCritique: string): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = `
    ${REVISION_PROMPT}

    REFERENCE CRITIQUE:
    ${originalCritique}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { text: prompt }
    });
    return response.text || "Could not generate checklist.";
  } catch (error) {
    console.error("Checklist Error:", error);
    return "Error generating checklist.";
  }
};
