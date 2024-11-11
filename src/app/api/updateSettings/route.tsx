import { NextRequest, NextResponse } from "next/server"
import fs from "fs";
import prisma from '@/lib/prismadb'
import { v4 as uuidV4 } from 'uuid'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Media, MediaType, User } from "@prisma/client";
import { UPLOAD_DIR } from "@/lib/utility";
import path from "path";

const uploadFile = async (file: File, type: MediaType, userID: string): Promise<Media> => {
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
            return Promise.reject(e)
        }
        console.log("File: ", file)
        let name = file.name.replaceAll(" ", "_")
        // Get the file extension
        let ext = name.split('.').filter(Boolean).slice(1).join('.');
        console.log(name)
        // Trim filename if needed
        if (name.length > 200) {
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
            return Promise.reject(e)
        }

        const mr = await prisma.media.create({
            data: {
                userID: userID,
                src: filename,
                type: type,
            }
        })

        return Promise.resolve(mr)
    }
    return Promise.reject("File not given")
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 409 });
    const d = await req.formData()
    const fdUsername = d.get('username') as string || ""
    const fdDisplayName = d.get('displayName') as string || ""
    const fdEmail = d.get('email') as string || ""
    const fdProfilePicture = d.get('profilePicture') as File
    const fdHeader = d.get('header') as File
    let ud: Partial<User> = {}

    if (fdUsername) {
        ud.username = fdUsername;
    }
    if (fdDisplayName) {
        ud.displayName = fdDisplayName;
    }
    if (fdEmail) {
        ud.email = fdEmail;
    }

    // Profile Picture
    await uploadFile(fdProfilePicture, MediaType.ProfilePicture, session.user.id).then((mr) => {
        ud.profilePicture = mr
    }).catch((e) => {
        return NextResponse.json({ error: e }, { status: 409 });
    })

    // Header
    await uploadFile(fdHeader, MediaType.Header, session.user.id).then((mr) => {
        ud.header = mr
    }).catch((e) => {
        return NextResponse.json({ error: e }, { status: 409 });
    })

    try {
        const r = await prisma.user.update({
            where: {
                id: session?.user.id
            },
            data: ud as any
        })
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e }, { status: 409 });
    }
}

