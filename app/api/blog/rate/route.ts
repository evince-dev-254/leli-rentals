import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const { blog_id, user_id, rating } = await req.json();

        if (!blog_id || !user_id || !rating) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("blog_ratings")
            .upsert(
                { blog_id, user_id, rating, created_at: new Date().toISOString() },
                { onConflict: 'blog_id,user_id' }
            )
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Rate Blog Error:", error);
        return NextResponse.json(
            { error: "Failed to submit rating", details: error.message },
            { status: 500 }
        );
    }
}
