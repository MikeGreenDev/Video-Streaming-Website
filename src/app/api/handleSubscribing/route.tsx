import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prismadb'
import { subscribe } from "diagnostics_channel";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });
    const d = await req.json()
    console.log(d);

    try {
        let da = {}
        if (d.subscribe) {
            da = {
                subscribers:{ connect: { id: session.user.id } }, 
                subCnt: {
                    increment: 1
                }
            }
        } else {
            da = {
                subscribers: { disconnect: { id: session.user.id } },
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
