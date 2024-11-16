import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { Prisma, Visibility } from "@prisma/client";

export async function GET(req: NextRequest) {
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const userID = urlParams.get('userID');
    const username = urlParams.get('username');
    const getVideos = urlParams.get('videos') === 'true'
    if (userID == null && username == null) return NextResponse.json({ error: "Need valid userID or username" }, { status: 521 })

    try {
        const userWhereObj = {} as Prisma.UserWhereUniqueInput
        userWhereObj.visibility = Visibility.Public
        if (userID) {
            userWhereObj.id = userID;
        }
        if (username) {
            userWhereObj.username = username
        }
        const data = await prisma.user.findUnique({
            where: userWhereObj,
            include: {videos: getVideos}
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
