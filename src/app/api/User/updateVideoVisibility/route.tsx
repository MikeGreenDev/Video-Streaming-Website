import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { Visibility } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });

    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const videoID = urlParams.get('videoID') as string;
    const visibility = urlParams.get('visibility');
    if (videoID == null) return NextResponse.json({ error: "Need valid VideoID" }, { status: 511 })
    if (visibility == null) return NextResponse.json({ error: "Need valid Visibility" }, { status: 511 })

    try {
        const data = await prisma.video.update({
            where: {
                id: videoID,
                uploaderID: session.user.id
            },
            data: {
                visibility: Visibility[visibility as keyof typeof Visibility]
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
