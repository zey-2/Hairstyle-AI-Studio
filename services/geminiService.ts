import { GoogleGenAI, Modality, Type, Chat, GenerateContentResponse } from "@google/genai";
import { BrandIdentity } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to convert a File object to the GoogleGenerativeAI.Part format.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // remove "data:mime/type;base64," prefix
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    }
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateImage = async (prompt: string, images: File[] = []): Promise<string> => {
    const model = 'gemini-2.5-flash-image';

    const imageParts = await Promise.all(
        images.map(fileToGenerativePart)
    );

    const contents = {
        parts: [
            ...imageParts,
            { text: prompt },
        ],
    };

    const generationPromise = ai.models.generateContent({
        model,
        contents,
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const timeoutPromise = new Promise<GenerateContentResponse>((_, reject) =>
        setTimeout(() => reject(new Error("Image generation timed out after 1 minute.")), 60000)
    );

    const response = await Promise.race([generationPromise, timeoutPromise]);


    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("No image was generated. The prompt may have been blocked.");
};

export const generateBrandBible = async (mission: string): Promise<BrandIdentity> => {
    const jsonPrompt = `
        Based on the company mission "${mission}", generate a brand identity.
        Provide a color palette of 5 colors (name, hex, description) and a font pairing (header and body font from Google Fonts).
    `;
    const model = 'gemini-2.5-flash';
    const jsonResponse = await ai.models.generateContent({
        model,
        contents: jsonPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    colorPalette: {
                        type: Type.ARRAY,
                        description: "An array of 5 color objects.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                hex: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                            required: ['name', 'hex', 'description']
                        }
                    },
                    fontPairing: {
                        type: Type.OBJECT,
                        description: "A header and body font pairing.",
                        properties: {
                            header: { type: Type.STRING },
                            body: { type: Type.STRING }
                        },
                        required: ['header', 'body']
                    }
                },
                required: ['colorPalette', 'fontPairing']
            }
        }
    });

    const brandInfo = JSON.parse(jsonResponse.text);

    const logoBasePrompt = `A modern, minimalist logo for a company with the mission: "${mission}".`;

    const primaryLogoPrompt = `Primary logo, suitable for a website header. ${logoBasePrompt}`;
    const secondaryMarkIconPrompt = `A simple, recognizable icon version of the logo. ${logoBasePrompt}`;
    const secondaryMarkWordmarkPrompt = `A text-only wordmark version of the logo. ${logoBasePrompt}`;

    const [primaryLogo, secondaryMarkIcon, secondaryMarkWordmark] = await Promise.all([
        generateImage(primaryLogoPrompt),
        generateImage(secondaryMarkIconPrompt),
        generateImage(secondaryMarkWordmarkPrompt)
    ]);

    return {
        ...brandInfo,
        primaryLogo,
        secondaryMarkIcon,
        secondaryMarkWordmark
    };
};

export const createChatSession = (): Chat => {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: 'You are a helpful and friendly chatbot.'
        }
    });
    return chat;
};