import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: myApiKey });

export const generateResult = async (prompt) => {

    

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });
   return response.text;
};
