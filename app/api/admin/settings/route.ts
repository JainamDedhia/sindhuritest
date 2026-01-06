import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
    try{
        const { rows } = await pool.query(`SELECT value FROM settings WHERE key = 'gold_rate'`);
        const rate = rows.length > 0 ? rows[0].value : "7000";

        return NextResponse.json({rate});
    }
    catch(error: any){
        console.error("Settings GET ERROR", error.message);
        return NextResponse.json({ error: "Failed to fetch rate"}, { status: 500});
    }
}

export async function POST(req: Request){
    try{
        const { rate } = await req.json();

        if(!rate || isNaN(Number(rate))){
            return NextResponse.json({ error: "Invaild rate"}, { status: 400});
        }

        await pool.query(
            `INSERT INTO settings (key, value, updated_at)
            VALUES ('gold_rate', $1, NOW())
            ON CONFLICT (key)
            DO UPDATE SET value = $1, updated_at = NOW()`,
            [rate.toString()]
        );

        return NextResponse.json({ success: true, rate});    
    }
    catch(error: any){
        console.error("Settings POST ERROR:", error.message);
        return NextResponse.json({ error: "Failed to Update rate"}, { status: 500});
    }
}