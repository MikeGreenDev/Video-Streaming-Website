import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                subscribedTo: true
            }
        })
        console.log(user)
        return NextResponse.json({ success: true, subscribedTo: user?.subscribedTo }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
