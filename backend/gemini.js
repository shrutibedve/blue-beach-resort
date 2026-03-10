const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

// ── Fallback mock responses ─────────────────────────────────────────────────
const mockSmartReply = (text = '') => {
    const t = text.toLowerCase();
    if (t.includes('wifi')) return "The Wi-Fi is 'BlueBeachGuest' — password: sandytoes2025.";
    if (t.includes('pool')) return "The pool is open 7 AM – 10 PM. Towels are available poolside.";
    if (t.includes('food') || t.includes('restaurant')) return "Breakfast runs 6–10 AM. The dinner buffet starts at 6 PM at The Horizon.";
    if (t.includes('towel') || t.includes('soap')) return "I've notified Housekeeping to bring those items immediately.";
    if (t.includes('late') || t.includes('checkout')) return "Late checkout until 1 PM can be arranged — shall I request it for you?";
    if (t.includes('taxi') || t.includes('transport')) return "I can arrange a taxi. Please share your destination and pickup time.";
    if (t.includes('ac') || t.includes('broken') || t.includes('noise')) return "I've dispatched Maintenance to your room right away. Apologies for the inconvenience.";
    return "Thank you for reaching out. A staff member will assist you shortly.";
};

const mockAnalyze = (text, gesture) => {
    const positive = text.toLowerCase().includes('good') || gesture === 'THUMBS_UP';
    return {
        sentimentScore: positive ? 0.8 : -0.4,
        keywords: text.split(' ').slice(0, 4),
        suggestedReply: "Thank you for your feedback. We truly value your stay at Blue Beach Resort.",
        flagPriority: !positive
    };
};

// ── Gemini helpers ───────────────────────────────────────────────────────────
const analyzeFeedback = async (fullText, gesture) => {
    if (!ai) return mockAnalyze(fullText, gesture);
    try {
        const res = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this resort guest feedback.
Feedback: "${fullText}"
Gesture: "${gesture}" (THUMBS_UP=positive, THUMBS_DOWN=negative, WAVE=neutral)

Return JSON with:
- sentimentScore: number -1.0 to 1.0
- keywords: string[] (max 5 topics)
- suggestedReply: short professional reply
- flagPriority: boolean (true if score < -0.5 or urgent issue)`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentimentScore: { type: Type.NUMBER },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestedReply: { type: Type.STRING },
                        flagPriority: { type: Type.BOOLEAN }
                    }
                }
            }
        });
        return JSON.parse(res.text);
    } catch (err) {
        console.error('[Gemini] analyzeFeedback failed:', err.message);
        return mockAnalyze(fullText, gesture);
    }
};

const generateQueryResponse = async (queryText) => {
    if (!ai) return mockSmartReply(queryText);
    try {
        const res = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are the Concierge AI at Blue Beach Resort, a luxury beach hotel.
Answer the guest query in 1-2 sentences, professionally and helpfully.
Context: WiFi=BlueBeachGuest/sandytoes2025, Pool 7am-10pm, Breakfast 6-10am.
If physical action needed, say you've dispatched a team member.
Guest query: "${queryText}"`
        });
        return res.text || mockSmartReply(queryText);
    } catch (err) {
        console.error('[Gemini] generateQueryResponse failed:', err.message);
        return mockSmartReply(queryText);
    }
};

module.exports = { analyzeFeedback, generateQueryResponse };
