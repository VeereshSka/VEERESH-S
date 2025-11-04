import { GoogleGenAI, Type } from "@google/genai";
import type { MedicalFacility, DiagnosisResult, PrognosisResult } from "../types";

// FIX: Simplified GoogleGenAI initialization to directly use process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDiagnosis = async (symptoms: string): Promise<DiagnosisResult[]> => {
  if (!symptoms) {
    return [];
  }

  const prompt = `
    Based on the following patient symptoms, identify a list of possible medical conditions (diseases). 
    For each condition, provide its name and the relevant medical category/specialty.

    Patient Symptoms: "${symptoms}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        disease: {
                            type: Type.STRING,
                            description: 'The name of the possible disease or condition.',
                        },
                        category: {
                            type: Type.STRING,
                            description: 'The medical category or specialty that this disease falls under (e.g., Cardiology, Neurology, Infectious Disease).',
                        },
                    },
                    required: ["disease", "category"],
                },
            },
        }
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
        return [];
    }
    const result: DiagnosisResult[] = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error generating diagnosis from Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const findNearbyFacilities = async (
  condition: string,
  location: { latitude: number; longitude: number }
): Promise<MedicalFacility[]> => {
  const prompt = `Based on the following medical analysis, list nearby rural clinics, Primary Health Centers (PHCs), or specialists that are well-suited to handle these conditions.
  Analysis: "${condition}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
            }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const facilities: MedicalFacility[] = groundingChunks
      .map((chunk: any) => {
        if (chunk.maps?.title && chunk.maps?.uri) {
          return {
            title: chunk.maps.title,
            uri: chunk.maps.uri,
          };
        }
        return null;
      })
      .filter((h: MedicalFacility | null): h is MedicalFacility => h !== null);
    
    return facilities;
  } catch (error) {
    console.error('Error finding nearby facilities:', error);
    throw new Error('Failed to communicate with the AI model for facility search.');
  }
};

interface PrognosisInput {
  symptoms: string;
  vitals: {
    heartRate: number;
    spO2: number;
    temperature: number;
  };
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export const getPrognosis = async (data: PrognosisInput): Promise<PrognosisResult> => {
      const prompt = `
        As an expert medical AI, analyze the following patient data to determine the most likely final diagnosis. 
        Provide a single, definitive condition, your confidence level in this diagnosis as a percentage, and a detailed, professional recommendation for a solution or treatment plan.

        Patient Data:
        - Age: ${data.age}
        - Gender: ${data.gender}
        - Symptoms: "${data.symptoms}"
        - Vitals:
          - Heart Rate: ${data.vitals.heartRate} bpm
          - SpO2: ${data.vitals.spO2}%
          - Temperature: ${data.vitals.temperature}°C

        Your response must be a single JSON object.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro', // Using a more powerful model for this complex task
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                predictedCondition: { type: Type.STRING, description: "The single most likely final diagnosis." },
                confidenceScore: { type: Type.NUMBER, description: "Confidence level for the diagnosis, from 0 to 100." },
                recommendedSolution: { type: Type.STRING, description: "A detailed treatment plan, including tests, medications, or lifestyle changes." }
              },
              required: ["predictedCondition", "confidenceScore", "recommendedSolution"]
            }
          }
        });
        
        const jsonString = response.text.trim();
        const result: PrognosisResult = JSON.parse(jsonString);
        return result;
      } catch (error) {
        console.error("Error generating prognosis from Gemini:", error);
        throw new Error("Failed to communicate with the AI model for prognosis.");
      }
    };