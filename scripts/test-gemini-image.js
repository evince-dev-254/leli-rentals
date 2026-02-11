require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testImageGen() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Try the experimental image generation model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    // Note: The model name for image gen might vary. 
    // The user's list showed: models/gemini-2.0-flash-exp-image-generation is NOT in the list?
    // Wait, let's re-read the list from Step 61.
    // It showed: models/gemini-2.0-flash-exp-image-generation IS in the list!

    const targetModel = "gemini-2.0-flash-exp-image-generation";

    console.log(`Testing image generation with ${targetModel}...`);

    try {
        const model = genAI.getGenerativeModel({ model: targetModel });

        const prompt = "A futuristic rental car in plain white background, high quality, photorealistic";

        // Image generation syntax for Gemini might differ from text.
        // Usually it's generateContent but we need to check if it supports returning image bytes.
        // For standard Google AI Studio, it might handle it.

        const result = await model.generateContent(prompt);
        const response = result.response;

        console.log("Response received.");
        // console.log(JSON.stringify(response, null, 2)); 

        // This is where it gets tricky. The SDK might not support parsing the image response directly 
        // if it's not in the standard text part.
        // Often it comes as inline data.

        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
            const parts = candidates[0].content.parts;
            console.log("Parts found:", parts.length);

            for (const part of parts) {
                if (part.inlineData) {
                    console.log("Image data found! MimeType:", part.inlineData.mimeType);
                    // fs.writeFileSync('test-image.png', Buffer.from(part.inlineData.data, 'base64'));
                    // console.log("Saved to test-image.png");
                } else if (part.text) {
                    console.log("Text:", part.text);
                }
            }
        }

    } catch (e) {
        console.error("Image generation failed:", e.message);
        console.error(e);
    }
}

testImageGen();
