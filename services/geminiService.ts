
import { GoogleGenAI } from "@google/genai";

/**
 * Safely retrieves the API Key from the environment.
 * Modern browsers and bundlers like Vite do not polyfill 'process' by default.
 */
const getApiKey = (): string => {
  try {
    // Check if process exists before accessing its properties
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Silently handle environment access errors
  }
  return '';
};

// Initialize AI client; if key is missing, specific calls will fail gracefully
// rather than crashing the entire application on load.
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const optimizeDescription = async (text: string, type: 'item' | 'notes'): Promise<string> => {
  if (!text) return text;
  
  const key = getApiKey();
  if (!key) {
    console.warn("Kurevi Finance Studio: Gemini API Key not found in environment.");
    return text;
  }
  
  try {
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
