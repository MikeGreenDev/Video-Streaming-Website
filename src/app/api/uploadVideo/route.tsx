import { NextRequest, NextResponse } from "next/server"
import path from "path";
import fs from "fs";
import {v4 as uuidV4} from 'uuid'
import prisma from '@/lib/prismadb'
import { MediaType } from "@prisma/client";

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_PATH ?? "", "public/uploads/")

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const files: File[] = data.getAll('files') as File[];
    const vidID: string = data.get('videoID') as string;
    const userID: string = data.get('userID') as string;
    let srcs: string[] = []

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "No Files received." }, { status: 400 });
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        let buffer: NodeJS.ArrayBufferView | string = "";
        if (file) {
            try {
                if (file.arrayBuffer) {
                    buffer = Buffer.from(await file.arrayBuffer());
                }
                if (!fs.existsSync(UPLOAD_DIR)) {
                    fs.mkdirSync(UPLOAD_DIR)
                }
            } catch (e: any) {
                return NextResponse.json({ error: e }, { status: 409 });
            }
            console.log("File: ", file)
            let name = file.name.replaceAll(" ", "_")
            // Get the file extension
            let ext = name.split('.').filter(Boolean).slice(1).join('.');
            console.log(name)
            // Trim filename if needed
            if (name.length > 200){
                name = name.slice(0, -33);
            }
            name = name.replaceAll('.', '');
            // Make the filename unique
            name = name + "_" + uuidV4() + "." + ext;
            console.log("Name: ", name)
            let filename = path.resolve(UPLOAD_DIR, name);
            try {
                fs.writeFileSync(
                    filename,
                    buffer
                )
                srcs.push(filename)
            } catch (e: any) {
                return NextResponse.json({ error: e }, { status: 409 });
            }

            const mr = await prisma.media.create({
                data: {
                    userID: userID,
                    src: filename,
                    type: MediaType.Video,
                    videoID: vidID
                }
            })

            const r = await prisma.video.update({
                where: {
                    id: vidID
                },
                data: {
                    media: JSON.stringify(mr)
                }
            })
        }
    }
    return NextResponse.json({ success: true, files: files, srcs: srcs }, { status: 200 });
}

