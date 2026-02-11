import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const { title, topic, category } = await req.json();

        if (!title && !topic) {
            return NextResponse.json(
                { error: "Title or topic is required" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash which is validated to work with this key
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `You are a professional content creator for Leli Rentals, Kenya's premier peer-to-peer rental marketplace.
        
        Generate a comprehensive, engaging, and SEO-optimized blog post for the following:
        Title/Topic: ${title || topic}
        Category: ${category || "General"}
        
        The response must be in JSON format with the following structure:
        {
          "title": "A catchy, SEO-friendly title",
          "excerpt": "A brief, compelling summary (150-200 characters)",
          "content": "The full blog post in HTML format. Use h2 for subheadings, p for paragraphs, and ul/li for lists. Do not include html or body tags. Make it detailed (at least 500 words).",
          "tags": ["tag1", "tag2", "tag3"],
          "readingTime": "X min read",
          "image_prompt": "A concise (under 50 words), highly detailed, photorealistic, cinematic 8k description of an image related to '${title || topic}'. Include specific items/activities. Style: modern, vibrant, high-quality blog cover. NO TEXT in image. Natural lighting."
        }
        
        Context for Leli Rentals: We are a global peer-to-peer rental marketplace. we rent cars, electronics, tools, home gear, etc. We focus on trust, safety (ID verification), and connecting people worldwide. Use $ or local currency as appropriate for a general audience.
        
        Ensure the tone is helpful, professional, and globally appealing.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        let blogData;
        try {
            blogData = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error. Raw Text:", text);
            // Fallback regex in case of slight formation issues (unlikely with json mode)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                blogData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse JSON from AI response");
            }
        }

        // Generate Image URL if prompt exists
        if (blogData.image_prompt) {
            // Append a random seed to ensure uniqueness and prevent caching
            // Use model=flux for better quality, set HD resolution
            const seed = Math.floor(Math.random() * 1000000);
            blogData.cover_image = `https://image.pollinations.ai/prompt/${encodeURIComponent(blogData.image_prompt)}?seed=${seed}&width=1280&height=720&model=flux&nologo=true`;
        }

        return NextResponse.json(blogData);
    } catch (error: any) {
        console.error("Blog Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate blog content", details: error.message },
            { status: 500 }
        );
    }
}
