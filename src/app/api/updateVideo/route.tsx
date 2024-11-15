import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MediaType, Video } from "@prisma/client";
import { uploadFile } from "@/lib/uploadFileHelper";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 409 });
    const d = await req.formData()
    const videoID = d.get('videoID') as string;
    const thumbnailID = d.get('thumbnailID') as string;
    const files = d.getAll('files') as File[]
    const title = d.get('title') as string
    const description = d.get('description') as string
    const tags = d.get('tags') as string
    let vd: Partial<Video> = {}
    if (title){
        vd.title = title;
    }
    if (description){
        vd.description = description;
    }
    if (tags){
        vd.tags = tags;
    }

    if (files[0]) {
        try {
            const mr = await uploadFile(files[0], MediaType.Thumbnail, session.user.id)
            // If file is uploaded correctly delete old thumbnail
            if (thumbnailID){
                await prisma.media.delete({
                    where: {
                        id: thumbnailID 
                    },
                })
            }
            vd.thumbnail = JSON.stringify(mr);
        } catch (e: any) {
            return NextResponse.json({ error: e }, { status: 409 });
        }
    }

    try {
        console.log("VD: ", vd)
        const r = await prisma.video.update({
            where: {
                id: videoID
            },
            data: vd as any
        })

        return NextResponse.json({ success: true, videoID: r.id }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 419 });
    }
}

