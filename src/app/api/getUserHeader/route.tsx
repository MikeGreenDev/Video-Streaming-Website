import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            },
            select: {
                header: true
            }
        })
        return NextResponse.json({ success: true, header: user?.header }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
