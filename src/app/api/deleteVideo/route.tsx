import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const d = await req.json()
    try {
        let mediaIDs = []
        if (d.media){
            mediaIDs.push(d.media.id);
        }
        if (d.thumbnail){
            mediaIDs.push(d.thumbnail.id);
        }
        if (mediaIDs.length > 0){
            await prisma.media.deleteMany({
                where: {
                    id: {
                        in: mediaIDs
                    }
                }
            })
        }

        // TODO: Mark videos to be deleted. Don't actually delete them right away
        await prisma.video.delete({
            where: {
                id: d.videoID,
                uploaderID: session?.user.id
            }
        })

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}

