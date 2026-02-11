
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const optimizeDescription = async (text: string, type: 'item' | 'notes'): Promise<string> => {
  if (!text) return text;
  
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
