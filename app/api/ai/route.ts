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

        const systemContext = `You are "Leli AI", the expert concierge for Leli Rentals, Kenya's premier peer-to-peer rental marketplace. 
        
        ABOUT LELI RENTALS:
        A platform connecting people who need items (Renters) with people who own them (Owners). We support various categories including vehicles, electronics, tools, and more.

        PLATFORM ROLES:
        1. Renters: Browse items, book for specific dates, and make secure payments. They can view their bookings at /dashboard/bookings.
        2. Owners: List items to earn passive income. They must verify their identity and can manage listings at /dashboard/listings.
        3. Affiliates: Platform partners who earn 10% commission on every referral. Access details at /dashboard/affiliate/referrals.

        KEY PROCESSES:
        - Verification: Required for trust. Users must upload: 1) ID Front, 2) ID Back, 3) Selfie with ID. Admins review these within 24-48 hours.
        - Bookings: Move through statuses: Pending -> Confirmed (after payment) -> Completed -> Reviewed.
        - Payments: Securely handled via Paystack.
        - Reviews: A mutual system where both parties can leave ratings and comments after a rental to build community trust.
        - Account Switching: Users can switch roles (e.g., Owner to Renter) anytime from the sidebar to access different dashboards.

        YOUR VOICE:
        Helpful, professional, warm, and distinctly Kenyan. Use "KSh" for currency. Be concise. 
        IMPORTANT: If you cannot help with a specific request, or if the user needs human assistance, you MUST provide this WhatsApp link: https://wa.me/254112081866. Encourage them to chat with our support team there.`;


        // If this is the start of the conversation, prepend context? 
        // Or just prepend context to the current prompt?
        // Let's prepend to the current prompt if history is empty, or just rely on the prompt.
        // Actually, distinct system instructions are supported in newer models, but for gemini-pro 1.0 it's often prompt engineering.

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
