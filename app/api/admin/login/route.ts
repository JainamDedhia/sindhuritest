import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true, 
        message: "Login successful" 
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}