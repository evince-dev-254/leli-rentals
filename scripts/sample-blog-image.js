require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateSample() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const topic = "Luxury Safari in Masai Mara";
    console.log(`Generating sample blog image prompt for topic: "${topic}"...`);

    const prompt = `
    Generate a JSON object with a "image_prompt" for a blog post about "${topic}".
    The image prompt should be: A highly detailed, photorealistic, cinematic 8k description of an image.
    It should feature the specific item or activity mentioned in the topic.
    The style should be modern, vibrant, and suitable for a high-quality blog cover. Do NOT include any text in the image.
    Lighting should be natural and professional.
    
    Response format: { "image_prompt": "..." }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);

        if (data.image_prompt) {
            console.log("\nGenerated Prompt:", data.image_prompt);
            const seed = Math.floor(Math.random() * 1000000);
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(data.image_prompt)}?seed=${seed}&width=1280&height=720&model=flux&nologo=true`;
            console.log("\nSample Image URL (Flux):");
            console.log(url);
        } else {
            console.log("No image prompt generated.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

generateSample();
