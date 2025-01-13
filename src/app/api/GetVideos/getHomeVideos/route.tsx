import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function GET() {
    try {
        //const data = await prisma.video.findMany({
        //    where: {
        //        visibility: Visibility.Public
        //    },
        //    take: 20
        //})

        // Use raw SQL to get random videos. (Prisma currently doesn't have a random findMany method)
        const data = await prisma.$queryRaw`SELECT * FROM videos WHERE visibility = 'Public' ORDER BY random() LIMIT 20;`
        return NextResponse.json({ success: true, videos: data }, {
            status: 200,
        })
    } catch (e) {
        return NextResponse.json({ error: e }, {
            status: 519,
        })
    }
}
