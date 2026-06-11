const { GoogleGenerativeAI } = require("@google/generative-ai");

let geminiClient = null;

const getGeminiClient = () => {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  return geminiClient;
};

const SYSTEM_PROMPT = `
You are an expert corporate event planner and venue concierge.

Return ONLY valid JSON.

Required format:

{
  "parsedIntent": {
    "attendees": null,
    "duration": null,
    "budget": null,
    "eventType": null,
    "preferences": []
  },
  "proposal": {
    "venueName": "",
    "location": "",
    "estimatedCost": "",
    "whyItFits": "",
    "capacity": "",
    "amenities": [],
    "venueType": ""
  },
  "alternativeVenues": [
    {
      "venueName": "",
      "location": "",
      "estimatedCost": "",
      "whyItFits": "",
      "capacity": "",
      "amenities": [],
      "venueType": ""
    },
    {
      "venueName": "",
      "location": "",
      "estimatedCost": "",
      "whyItFits": "",
      "capacity": "",
      "amenities": [],
      "venueType": ""
    }
  ]
}

Rules:
- Return ONLY JSON
- No markdown
- No backticks
- Exactly 2 alternative venues
- whyItFits maximum 1 sentence
- amenities maximum 4 items
`;

const generateVenueProposal = async (userQuery) => {
  const client = getGeminiClient();
  const startTime = Date.now();

  try {
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3000,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Analyze this event request and generate a venue proposal.

Event Request:
"${userQuery}"

Remember:
- Return valid JSON only
- Keep descriptions concise
- Exactly 2 alternative venues
`;

    const result = await model.generateContent(prompt);

    console.log(
      "Finish Reason:",
      result?.response?.candidates?.[0]?.finishReason,
    );

    const rawContent = result.response.text();

    console.log("\n===== GEMINI RAW RESPONSE =====");
    console.log(rawContent);
    console.log("===== END RESPONSE =====\n");

    const processingTimeMs = Date.now() - startTime;

    let parsed;

    try {
      parsed = JSON.parse(rawContent);
    } catch (error) {
      try {
        const cleaned = rawContent
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        parsed = JSON.parse(cleaned);
      } catch {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error(
            `No JSON object found in Gemini response:\n${rawContent}`,
          );
        }

        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error(`Invalid JSON returned by Gemini:\n${rawContent}`);
        }
      }
    }

    if (!parsed) {
      throw new Error("Failed to parse Gemini response");
    }

    if (!parsed.proposal) {
      throw new Error("Missing proposal object in AI response");
    }

    if (!parsed.proposal.venueName) {
      throw new Error("Missing venueName in AI response");
    }

    if (!Array.isArray(parsed.alternativeVenues)) {
      parsed.alternativeVenues = [];
    }

    return {
      parsedIntent: parsed.parsedIntent || {},
      proposal: parsed.proposal,
      alternativeVenues: parsed.alternativeVenues,
      aiModel: "gemini-2.5-flash",
      processingTimeMs,
    };
  } catch (error) {
    console.error("[GEMINI ERROR]");
    console.error(error);

    throw error;
  }
};

module.exports = {
  generateVenueProposal,
};
