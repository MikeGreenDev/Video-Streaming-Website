import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { Visibility } from "@prisma/client";

export async function GET(req: NextRequest) {
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const userID = urlParams.get('userID');
    if (userID == null) return NextResponse.json({ error: "Need valid userID" }, { status: 521 })

    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userID,
                visibility: Visibility.Public
            }
        })
        return NextResponse.json({ success: true, publicUser: data }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 529,
        })
    }
}
