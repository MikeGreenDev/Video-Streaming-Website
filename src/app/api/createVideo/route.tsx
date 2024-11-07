import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const d = await req.json()
    console.log(d);
    try {
        const r = await prisma.video.create({
            data: {
                title: d.title,
                description: d.description,
                tags: d.tags,
                uploader: {
                    connect: {
                        id: session?.user.id
                    }
                }
            },
        })

        return NextResponse.json({ success: true, videoID: r.id }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}

