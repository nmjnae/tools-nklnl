import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
    const contentType = request.headers.get("content-type") || "";
    const body = await request.arrayBuffer();
    const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "content-type": contentType },
        body: Buffer.from(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}
