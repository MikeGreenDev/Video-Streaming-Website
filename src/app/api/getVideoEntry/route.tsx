import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function GET(req: NextRequest) {
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const videoID = urlParams.get('videoID');
    if (videoID == null) return NextResponse.json({ error: "Need valid VideoID" }, { status: 511 })

    try {
        const data = await prisma.video.findUnique({
            where: {
                id: videoID
            }
        })
        return NextResponse.json({ success: true, video: data }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
