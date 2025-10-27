
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateDescription = async (speciesName: string, scientificName: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API key not configured. Please add a description manually.";
  }
  try {
    const prompt = `Write a concise, one-paragraph description for the aquatic species "${speciesName}" (scientific name: ${scientificName}). Focus on its key characteristics, appearance, and natural habitat. The description should be suitable for a laboratory catalog.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Failed to generate description. Please try again or write one manually.";
  }
};
