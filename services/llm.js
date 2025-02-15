const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const processNote = async (noteContent) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Analyze the following medical note and extract actionable steps.
            
            **Instructions**:
            - Extract tasks from the note and return a **valid JSON object** with two keys: "checklist" and "plan".
            - "checklist" should be an **array of strings** representing immediate tasks (e.g., ["Buy amoxicillin 500mg"]).
            - "plan" should be an **array of objects**, each containing:
              - **"description"** (task description)
              - **"startDate"** (YYYY-MM-DD format)
              - **"duration"** (number of days)
            - If no actionable steps exist, at least return **one general recommendation**.
            
            **Example Response (strictly JSON, no markdown or formatting):**
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

        // Debugging Logs
        // console.log("🔍 LLM Raw Response:", JSON.stringify(result, null, 2));

        const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!responseText) {
            console.error("⚠️ LLM response was empty or malformed:", result);
            return { checklist: [], plan: [] };
        }

        // Ensure response is valid JSON
        const cleanJson = responseText.replace(/```json|```/g, "").trim(); // Remove markdown if present
        const parsedResponse = JSON.parse(cleanJson);

        // Debugging: Log the extracted actionable steps
        // console.log("✅ Extracted Actionable Steps:", parsedResponse);

        return {
            checklist: parsedResponse.checklist || [],
            plan: parsedResponse.plan || []
        };
    } catch (error) {
        console.error("❌ Error processing note with LLM:", error);
        return { checklist: [], plan: [] };
    }
};

module.exports = { processNote };
