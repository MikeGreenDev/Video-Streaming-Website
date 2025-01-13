import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });

    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const type = urlParams.get('type');
    let include = {};

    if (type === null || type === 'full') {
        include = { subscribers: true, subscribedTo: true, videos: true }
    } else if (type === 'videos') {
        include = { videos: true }
    } else if (type === 'subscribers') {
        include = { subscribers: true }
    }else if (type === 'subscribedTo'){
        include = { subscribedTo: true }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: include
        })
        return NextResponse.json({ success: true, user: user }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
