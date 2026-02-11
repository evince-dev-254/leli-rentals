require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

async function testPrompt(topic) {
    console.log(`\n--- Testing Topic: ${topic} ---`);

    // NEW IMPROVED PROMPT
    const prompt = `You are a professional content creator for Leli Rentals, Kenya's premier peer-to-peer rental marketplace.
        
    Generate a comprehensive, engaging, and SEO-optimized blog post for the following:
    Title/Topic: ${topic}
    Category: General
    
    The response must be in JSON format with the following structure:
    {
      "title": "A catchy, SEO-friendly title",
      "excerpt": "A brief, compelling summary (150-200 characters)",
      "content": "The full blog post in HTML format...",
      "tags": ["tag1", "tag2", "tag3"],
      "readingTime": "X min read",
      "image_prompt": "A highly detailed, photorealistic description of an image specifically related to the '${topic}'. It should NOT be a generic image of people smiling. It should feature the specific item or activity mentioned in the topic (e.g., if the topic is about cameras, describe a camera; if cars, describe a car). The style should be vibrant, modern, and high-quality, suitable for a blog cover. Avoid text in the image."
    }
    
    Context for Leli Rentals: We are a global peer-to-peer rental marketplace. We rent cars, electronics, tools, home gear, etc. We focus on trust, safety (ID verification), and connecting people worldwide. Use $ or local currency as appropriate for a general audience.
    
    Ensure the tone is helpful, professional, and globally appealing.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);
        console.log("Generated Title:", data.title);
        console.log("Generated Image Prompt:", data.image_prompt);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function run() {
    await testPrompt("How to rent a car in Nairobi");
    await testPrompt("Best cameras for wedding photography");
    await testPrompt("Safety tips for renting out your tools");
}

run();
