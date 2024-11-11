import { NextResponse } from "next/server"
import { JwtPayload, verify } from "jsonwebtoken";
import prisma from '@/lib/prismadb'
import { createAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST() {
    const token = cookies().get('refresh-token')?.value 
    console.log(token)
    if (!token) return NextResponse.json({ error: "Failed" }, { status: 409 });
    let payload = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET || "") as JwtPayload

        const user = await prisma.user.findUnique({
            where: {
                id: payload.id 
            },
            select: {
                id: true,
                username: true,
                email: true,
            }
        })
        if (!user) return NextResponse.json({ error: "Failed" }, { status: 409 });

        const accessToken = createAccessToken(user);
        return NextResponse.json({success: true, accessToken, user}, {status: 200})
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}

