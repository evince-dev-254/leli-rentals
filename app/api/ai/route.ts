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

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Construct history from previous messages (excluding the last one which is the new prompt)
        let history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Gemini requires history to start with user. Remove leading model messages.
        while (history.length > 0 && history[0].role === 'model') {
            history.shift();
        }

        // Start chat with history
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        // Provide context about the website in the system prompt equivalent (using first user message injection or prepend)
        // Actually, Gemini Pro doesn't have a strict "system" role in history yet, so we can prepend context to the first message 
        // or just rely on the model's general capability + context injection.

        // A better way with startChat is to just send the message.
        // If we want a system prompt, we can inject it into the history as a user message at the start, 
        // but here we just process the latest message.

        const systemContext = `You are a helpful AI assistant for "leli rentals", a peer-to-peer rental marketplace. 
    Platform Roles:
    - Renters: Browse and rent items from owners.
    - Owners: List items (cameras, drones, tools, etc.) to earn money.
    - Affiliates: Refer users and earn 10% commission.
    
    Key Features:
    - Secure payments (Paystack).
    - ID verification for trust.
    - Real-time messaging.
    
    Be concise, friendly, and helpful. If asked about technical issues, suggest contacting support.`;

        // If this is the start of the conversation, prepend context? 
        // Or just prepend context to the current prompt?
        // Let's prepend to the current prompt if history is empty, or just rely on the prompt.
        // Actually, distinct system instructions are supported in newer models, but for gemini-pro 1.0 it's often prompt engineering.
        // We'll just prepend to the prompt message.

        const prompt = `${systemContext}\n\nUser Question: ${lastMessage.content}`;

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ role: 'assistant', content: text });
    } catch (error: any) {
        console.error("AI Error Detailed:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
        });
        return NextResponse.json(
            { error: "Failed to generate response", details: error.message },
            { status: 500 }
        );
    }
}
