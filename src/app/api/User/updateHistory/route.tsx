import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prismadb'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });

    const d = await req.json()
    console.log(d);

    try {
        if (d.videoLink == null || d.videoLink == "" || d.videoLink == undefined){
            return NextResponse.json({ error: "VideoLink not found" }, { status: 439 });
        }

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                history: {
                    push: d.videoLink
                }
            },
        })
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}
