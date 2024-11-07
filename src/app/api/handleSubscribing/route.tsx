import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prismadb'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const d = await req.json()
    console.log(d);

    try {
        let da = {}
        if (d.subscribe) {
            da = {
                subscribedTo:{ connect: { id: session?.user.id } }, 
                subCnt: {
                    increment: 1
                }
            }
        } else {
            da = {
                subscribedTo:{ disconnect: { id: session?.user.id } }, 
                subCnt: {
                    decrement: 1
                }
            }
        }
        await prisma.user.update({
            where: {
                id: d.uploaderID
            },
            data: da,
            include: {subscribers: true, subscribedTo: true}
        })
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}
