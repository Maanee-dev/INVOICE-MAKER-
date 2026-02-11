
import { GoogleGenAI } from "@google/genai";

/**
 * Safely retrieves the API Key from the environment.
 */
const getApiKey = (): string => {
  try {
    // Vite uses import.meta.env, but the SDK often looks for process.env
    // We check both to be safe.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Fail silently
  }
  return '';
};

export const optimizeDescription = async (text: string, type: 'item' | 'notes'): Promise<string> => {
  if (!text) return text;
  
  const key = getApiKey();
  if (!key) {
    console.warn("Kurevi: API Key missing. Skipping optimization.");
    return text;
  }
  
  try {
    // Initialize inside the function to avoid top-level load errors
    const ai = new GoogleGenAI({ apiKey: key });
    
    const prompt = type === 'item' 
      ? `Rewrite this marketing service line item to sound more professional, high-end, and results-oriented for a boutique marketing agency called Kurevi. Keep it concise (max 15 words). Text: "${text}"`
      : `Rewrite this "Thank You" note or terms summary for a marketing invoice/quotation. Make it sound elegant, professional, and appreciative of the partnership. Keep it under 40 words. Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return text;
  }
};
