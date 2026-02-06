import { GoogleGenAI, Type } from "@google/genai";
import { AyurvedicSearchResponse, Patient } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const ayurvedicSearchSystemInstruction = `You are an expert Ayurvedic assistant. Your task is to respond to user queries about Ayurvedic treatments, herbs, or concepts. Use the provided Google Search results to give up-to-date and accurate information. Format your response in clean Markdown.`;

export const searchAyurveda = async (query: string): Promise<AyurvedicSearchResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find comprehensive Ayurvedic information about: ${query}`,
      config: {
        systemInstruction: ayurvedicSearchSystemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({
        title: web.title || 'Source',
        uri: web.uri
      })) || [];

    return { content: text, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch data from Google Search/Ayurvedic knowledge base. Please check your connection.");
  }
};

export const getPatientInsights = async (patient: Patient): Promise<string> => {
    const patientSummarySystemInstruction = `You are an Ayurvedic expert providing a high-level summary and general pointers for a qualified practitioner based on a patient's condition and history. 
    Your response should be concise, professional, and supportive. 
    - Briefly summarize the key points from the patient's data.
    - Suggest general Ayurvedic concepts or areas of focus (e.g., "balancing Vata dosha") that may be relevant.
    - DO NOT provide a diagnosis or specific medical advice. 
    - Frame the response as helpful notes for Dr. Rachitha.`;

    const prompt = `
      Assistant notes for:
      - Presenting Condition: ${patient.condition}
      - Medical History: ${patient.history || 'Not provided'}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: patientSummarySystemInstruction,
                temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for patient insights:", error);
        throw new Error("Failed to get insights from the AI assistant.");
    }
};

export const getDoshaAnalysis = async (patient: Patient): Promise<string> => {
    const doshaAnalysisSystemInstruction = `Identify the most likely dominant Dosha (Vata, Pitta, or Kapha) imbalance based on symptoms. Provide a brief explanation. Start with "Vata Dominant:", "Pitta Dominant:", or "Kapha Dominant:". This is theoretical for a practitioner.`;
    
    const prompt = `
      Analyze Prakriti:
      - Presenting Condition: ${patient.condition}
      - Medical History: ${patient.history || 'Not provided'}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: doshaAnalysisSystemInstruction,
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for Dosha analysis:", error);
        throw new Error("Failed to get Prakriti analysis.");
    }
};

export const generateWellnessPlan = async (patient: Patient): Promise<string> => {
    const wellnessPlanSystemInstruction = `You are an expert Ayurvedic assistant creating a structured wellness plan for Dr. Rachitha to review.
    Use "###" for headings: ### Dietary Suggestions, ### Lifestyle Adjustments, ### Herbal Considerations.
    Focus on foundational Ayurvedic principles. professional and supportive.`;

    const prompt = `
      Wellness plan for:
      - Condition: ${patient.condition}
      - History: ${patient.history || 'Not provided'}
      - Age: ${patient.age}
      - Gender: ${patient.gender}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: wellnessPlanSystemInstruction,
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for wellness plan:", error);
        throw new Error("Failed to generate a wellness plan.");
    }
};