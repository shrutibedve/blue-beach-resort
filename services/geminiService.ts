import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GestureType } from "../types";

const API_KEY = process.env.API_KEY || '';

// --- Smart Mock Logic for Demo Purposes (When API Key is missing) ---

const mockSmartReply = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes('wifi') || t.includes('internet')) return "The Wi-Fi network is 'BlueBeachGuest' and the password is 'sandytoes2025'.";
  if (t.includes('pool') || t.includes('swim')) return "The main pool is open from 7:00 AM to 10:00 PM daily. Towels are available poolside.";
  if (t.includes('food') || t.includes('dinner') || t.includes('breakfast') || t.includes('restaurant') || t.includes('buffet')) return "Breakfast is served 6-10 AM. Dinner buffet starts at 6 PM at The Horizon. Would you like to reserve a table?";
  if (t.includes('towel') || t.includes('soap') || t.includes('shampoo') || t.includes('amenit')) return "I have notified Housekeeping to bring those items to your room immediately.";
  if (t.includes('late') || t.includes('checkout')) return "Late checkout is subject to availability. I can request a 1 PM checkout for you at no extra charge.";
  if (t.includes('taxi') || t.includes('cab') || t.includes('transport')) return "I can arrange a taxi for you. Please let me know your destination and pickup time.";
  if (t.includes('ac') || t.includes('air') || t.includes('broken') || t.includes('noise')) return "I apologize for the inconvenience. I have dispatched our maintenance team to check your room right away.";
  
  return "Thank you for reaching out. I have logged your request and a staff member will assist you shortly.";
};

const mockAnalyze = (text: string, gesture: GestureType): AnalysisResult => {
  const isPositive = text.toLowerCase().includes('good') || text.toLowerCase().includes('great') || gesture === GestureType.THUMBS_UP;
  return {
    sentimentScore: isPositive ? 0.8 : -0.4,
    keywords: text.split(' ').slice(0, 3), // simple mock keywords
    suggestedReply: "Thank you for your feedback! We appreciate your visit to Blue Beach Resort.",
    flagPriority: !isPositive
  };
};

// --- Real API Logic ---

export const analyzeFeedback = async (
  fullText: string,
  gesture: GestureType
): Promise<AnalysisResult> => {
  if (!API_KEY) {
    // console.warn("Gemini API Key missing. Using mock analysis.");
    return new Promise(resolve => setTimeout(() => resolve(mockAnalyze(fullText, gesture)), 1500));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      Analyze the following guest feedback for Blue Beach Resort.
      
      Feedback Text: "${fullText}"
      Gesture Detected: "${gesture}" (THUMBS_UP adds positivity, THUMBS_DOWN adds negativity, WAVE is neutral).

      Return a JSON object with:
      - sentimentScore: number between -1.0 (very negative) and 1.0 (very positive).
      - keywords: array of strings (max 5 key topics).
      - suggestedReply: A professional, polite response from the resort management.
      - flagPriority: boolean (true if sentiment is below -0.5 or contains urgent safety/hygiene issues).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedReply: { type: Type.STRING },
            flagPriority: { type: Type.BOOLEAN },
          }
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from Gemini");
    
    return JSON.parse(textResponse) as AnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return mockAnalyze(fullText, gesture);
  }
};

export const generateQueryResponse = async (queryText: string): Promise<string> => {
  if (!API_KEY) {
     // Enhanced Mock Response
     return new Promise(resolve => setTimeout(() => resolve(mockSmartReply(queryText)), 1000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Concierge AI at Blue Beach Resort, a luxury beachside hotel. 
      Answer the following guest query professionally, briefly (max 2 sentences), and helpfully.
      
      Context:
      - Wifi: BlueGuest / sandytoes2025
      - Pool: 7am - 10pm
      - Breakfast: 6am - 10am
      - If it requires physical action (like towels, maintenance), say you have dispatched a team member.
      
      Guest Query: "${queryText}"`
    });
    return response.text || mockSmartReply(queryText);
  } catch (e) {
    console.error("AI Query Gen Failed", e);
    return mockSmartReply(queryText);
  }
};

export const getRealTimeSuggestion = async (currentText: string, category: string): Promise<string | null> => {
  if (!currentText || currentText.length < 5) return null;
  
  if (!API_KEY) {
    const suggestions = [
      "Was the staff friendly?",
      "How was the cleanliness?",
      "Did you like the view?",
      "Was the service fast?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is typing feedback about ${category} for a hotel. 
      They wrote: "${currentText}".
      Suggest one short question (max 6 words) to prompt them for more detail. 
      Example: "How was the bed comfort?"`
    });
    return response.text;
  } catch {
    return null;
  }
};

export const analyzeImageContent = async (base64Image: string, category: string): Promise<{ caption: string; rating: number; emoji: string } | null> => {
  if (!API_KEY) {
    // Mock for missing API key
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      caption: "I see a photo! (AI Vision Mock)",
      rating: 4,
      emoji: "🙂"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `The user uploaded this photo for the hotel category: ${category}. 
            1. Describe what is in the image in one short sentence (max 10 words).
            2. Estimate a satisfaction rating from 1 (Angry/Bad) to 5 (Loved it/Perfect).
            3. Pick one emoji that matches the feeling: 😤, 😕, 😐, 🙂, 😍.
            
            Return JSON.` 
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             caption: { type: Type.STRING },
             rating: { type: Type.INTEGER },
             emoji: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
       return JSON.parse(response.text);
    }
    return null;
  } catch (e) {
    console.error("Vision analysis failed", e);
    return null;
  }
};