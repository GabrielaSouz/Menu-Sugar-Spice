import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }

        return NextResponse.json({ 
            success: true, 
            session: data.session,
            user: data.user 
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
