const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const processNote = async (noteContent) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Analyze the following medical note and extract actionable steps.
            **Instructions**:
            - Return a **JSON object** with two keys: "checklist" and "plan".
            - "checklist" should contain **one-time immediate tasks** (e.g., "Buy amoxicillin 500mg").
            - "plan" should be an **array of objects** each with:
              - **"description"** (task description)
              - **"startDate"** (YYYY-MM-DD)
              - **"duration"** (number of days)
            
            Example Response:
            {
              "checklist": ["Buy amoxicillin 500mg", "Schedule follow-up appointment"],
              "plan": [
                { "description": "Take 500mg amoxicillin twice a day", "startDate": "2025-02-15", "duration": 7 }
              ]
            }
            
            **Medical Note**:
            ${noteContent}
        `;

        const result = await model.generateContent(prompt);

        // 🔴 Log full response for debugging
        console.log("LLM Raw Response:", JSON.stringify(result, null, 2));

        const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || null;

        if (!responseText) {
            console.error("⚠️ LLM response was empty or malformed:", result);
            return { checklist: [], plan: [] };
        }

        const response = JSON.parse(responseText);
        return {
            checklist: response.checklist || [],
            plan: response.plan || []
        };
    } catch (error) {
        console.error("❌ Error processing note with LLM:", error);
        return { checklist: [], plan: [] };
    }
};

module.exports = { processNote };
