import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { User, Video, Visibility } from "@prisma/client";

export async function GET(req: NextRequest) {
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    // TODO: Add filters
    const query = urlParams.get('query')?.toString() || ""

    try {
        let results: (Video | User)[] = []

        const userData: (Video | User)[] = await prisma.user.findMany({
            where: {
                visibility: Visibility.Public,
                OR: [
                    {
                        username: {
                            contains: query
                        }
                    },
                    {
                        displayName: {
                            contains: query
                        }
                    }
                ]
            },
        })

        const videoData = await prisma.video.findMany({
            where: {
                visibility: Visibility.Public,
                title: {
                    contains: query
                }
            },
            include: {
                likes: true,
                dislikes: true,
                uploader: {
                    select: {
                        displayName: true,
                        username: true,
                        profilePicture: true,
                        subCnt: true
                    }
                }
            }
        })

        // TODO: Change the order to show higher views/subCnts
        results = userData.concat(videoData);

        return NextResponse.json({ success: true, results: results }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 529,
        })
    }
}
