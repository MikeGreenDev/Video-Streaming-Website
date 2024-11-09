import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prismadb'

type dataType = {
    likes: any,
    dislikes: any
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const d = await req.json()
    console.log(d);

    try {
        let da: dataType = {} as dataType
        if (d.like) {
            da.likes = { connect: { id: session?.user.id } }
        } else {
            da.likes = { disconnect: { id: session?.user.id } }
        }

        if (d.dislike) {
            da.dislikes = { connect: { id: session?.user.id } }
        } else {
            da.dislikes = { disconnect: { id: session?.user.id } }
        }

        await prisma.video.update({
            where: {
                id: d.videoID
            },
            data: da
        })
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}