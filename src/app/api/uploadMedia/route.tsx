import { NextRequest, NextResponse } from "next/server"
import path from "path";
import fs from "fs";
import {v4 as uuidV4} from 'uuid'
import prisma from '@/lib/prismadb'
import { MediaType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UPLOAD_DIR } from "@/lib/uploadFileHelper";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const files: File[] = data.getAll('files') as File[];
    const vidID: string = data.get('videoID') as string;
    const type: string = data.get('type') as string;
    const session = await getServerSession(authOptions)
    const userID = session?.user.id
    if (!userID){
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

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
            } catch (e: any) {
                return NextResponse.json({ error: e }, { status: 409 });
            }

            let mt: MediaType = MediaType.Video;
            if (type === "ProfilePicture"){
                mt = MediaType.ProfilePicture
            }else if (type === "Thumbnail"){
                mt = MediaType.Thumbnail
            }

            const mr = await prisma.media.create({
                data: {
                    userID: userID,
                    src: filename,
                    type: mt,
                    videoID: vidID
                }
            })

            let vd = {}
            if (type === "Video"){
                vd = {media: mr}
            }else if (type === "ProfilePicture"){
                vd = {profilePicture: mr}
            }else if (type === "Thumbnail"){
                vd = {thumbnail: mr}
            }

            const r = await prisma.video.update({
                where: {
                    id: vidID
                },
                data: vd
            })
        }
    }
    return NextResponse.json({ success: true, files: files }, { status: 200 });
}

