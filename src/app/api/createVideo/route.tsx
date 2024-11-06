import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'

export async function POST(req: NextRequest) {
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
                        id: d.userID
                    }
                }
            },
        })

        return NextResponse.json({ success: true, videoID: r.id }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}

