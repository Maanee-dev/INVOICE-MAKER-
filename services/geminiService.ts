
import { GoogleGenAI } from "@google/genai";

/**
 * Safely retrieves the API Key.
 * Checks multiple possible locations and handles missing globals gracefully.
 */
const getApiKey = (): string => {
  try {
    // 1. Check standard process.env (Node/Webpack)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    
    // 2. Check window.process.env (Polyfilled)
    const win = window as any;
    if (win.process?.env?.API_KEY) {
      return win.process.env.API_KEY;
    }

    // 3. Check Vite import.meta (Build time)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Fail silently to prevent app crash
  }
  return '';
};

export const optimizeDescription = async (text: string, type: 'item' | 'notes'): Promise<string> => {
  if (!text) return text;
  
  const key = getApiKey();
  if (!key) {
    return text;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = type === 'item' 
      ? `Refine this marketing service description for Kurevi Studio (high-end). Max 20 words: "${text}"`
      : `Refine these billing terms for Kurevi Studio. Professional and elegant. Max 30 words: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.warn("AI Optimization bypassed:", error);
    return text;
  }
};
