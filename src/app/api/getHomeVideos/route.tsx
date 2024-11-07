import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function GET(req: NextRequest) {
    try {
        const data = await prisma.video.findMany({
            take: 20
        })
        return NextResponse.json({ success: true, videos: data }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
