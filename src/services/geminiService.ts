import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeNeuralProfile(resumeText: string, roleRequirements: string): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Analyze the following resume content against the provided role requirements.
    Provide a deep neural synthesis of the candidate's capabilities, gaps, and evolutionary path.
    
    Resume Content:
    ${resumeText}
    
    Role Requirements:
    ${roleRequirements}
    
    Return the analysis in the following JSON format:
    {
      "score": number (0-100),
      "skills": [
        { "name": string, "level": number (0-100), "status": "mastered" | "developing" | "gap" }
      ],
      "reasoning": string (detailed analysis),
      "distribution": [
        { "subject": string, "A": number, "B": number, "fullMark": number }
      ],
      "benchmarking": [
        { "name": string, "current": number, "target": number }
      ]
    }
    
    The "distribution" should have 6 subjects for a radar chart (e.g., Technical, Leadership, Strategy, etc.).
    The "benchmarking" should compare the candidate's current level vs the target role's required level for 5 key skills.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ["mastered", "developing", "gap"] }
              },
              required: ["name", "level", "status"]
            }
          },
          reasoning: { type: Type.STRING },
          distribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                A: { type: Type.NUMBER },
                B: { type: Type.NUMBER },
                fullMark: { type: Type.NUMBER }
              },
              required: ["subject", "A", "B", "fullMark"]
            }
          },
          benchmarking: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                current: { type: Type.NUMBER },
                target: { type: Type.NUMBER }
              },
              required: ["name", "current", "target"]
            }
          }
        },
        required: ["score", "skills", "reasoning", "distribution", "benchmarking"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
}
