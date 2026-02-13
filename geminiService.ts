
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_CARDS, CATEGORIES } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCardRecommendation = async (merchant: string, category: string, amount: number) => {
  const cardsInfo = MOCK_CARDS.map(c => 
    `${c.name} (Bank: ${c.bank}) offers: ${JSON.stringify(c.cashbackRates)}`
  ).join('\n');

  const prompt = `
    Context: You are the Project Picasso "Recommendation Agent" specialized in the Malaysian credit card market.
    User is at a checkout for ${merchant} (${category}) with an amount of RM${amount}.
    
    Available Malaysian Cards in Portfolio:
    ${cardsInfo}
    
    Task: Identify which card from the list above offers the highest cashback for this specific transaction.
    If multiple cards offer the same rate, pick one and explain the tie-break logic.
    Return a detailed reasoning explaining the choice (XAI).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cardName: { type: Type.STRING },
          cashbackAmount: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["cardName", "cashbackAmount", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const scanDocument = async (base64Data: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `Analyze this receipt or statement from Malaysia. Extract:
          1. Merchant name
          2. Total amount (as number)
          3. Transaction date (YYYY-MM-DD format)
          4. Suggested category (${CATEGORIES.join(', ')})
          5. Card used (Detect card name/bank if visible, e.g. "Maybank", "CIMB")
          6. Cashback/Rewards earned
          7. Currency code (e.g., MYR, USD)
          8. Currency symbol (e.g., RM, $)
        ` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          merchant: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          date: { type: Type.STRING },
          category: { type: Type.STRING },
          cardUsed: { type: Type.STRING },
          cashbackEarned: { type: Type.NUMBER },
          currencyCode: { type: Type.STRING },
          currencySymbol: { type: Type.STRING }
        },
        required: ["merchant", "amount", "category", "date", "cardUsed", "cashbackEarned", "currencyCode", "currencySymbol"]
      }
    }
  });

  return JSON.parse(response.text);
};
