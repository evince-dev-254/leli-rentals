require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking API Key: ", apiKey ? "Found (" + apiKey.substring(0, 5) + "...)" : "Missing");

    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is missing in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Checking available models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("List models failed:", data);
            return;
        }

        console.log("Available models:");
        const models = data.models || [];
        models.forEach(m => console.log(`- ${m.name}`));

        // Direct test of the model we want to use
        const targetModel = "gemini-2.5-flash";
        console.log(`\nTesting ${targetModel} with JSON mode...`);

        try {
            const model = genAI.getGenerativeModel({
                model: targetModel,
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `List 3 colors. JSON format: { "colors": [] }`;
            const result = await model.generateContent(prompt);
            console.log("JSON Generation successful.");
            console.log(result.response.text());
        } catch (e) {
            console.error(`JSON mode failed for ${targetModel}:`, e.message);

            // Fallback test without JSON mode
            console.log(`Retrying ${targetModel} without JSON mode...`);
            const model = genAI.getGenerativeModel({ model: targetModel });
            const result = await model.generateContent("List 3 colors in JSON");
            console.log("Plain Generation successful.");
            console.log(result.response.text());
        }
    } catch (error) {
        console.error("Error during test:", error);
    }
}

testGemini();
