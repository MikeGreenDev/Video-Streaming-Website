import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Media, MediaType, User } from "@prisma/client";
import { uploadFile } from "@/lib/uploadFileHelper";
import { JsonValue } from "@prisma/client/runtime/library";

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

    let userPics: JsonValue | null = null;

    // Get the user's info, to get the old profilePicture & header
    try {
        userPics = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                profilePicture: fdProfilePicture !== null,
                header: fdHeader !== null,
            }
        })
    }catch(e: any){
        return NextResponse.json({ error: e }, { status: 409 });
    }

    if (!userPics){
        return NextResponse.json({ error: "Could not get user pictures." }, { status: 409 });
    }

    if (fdProfilePicture) {
        // Profile Picture
        await uploadFile(fdProfilePicture, MediaType.ProfilePicture, session.user.id).then(async (mr) => {
            ud.profilePicture = mr
            // Delete the old pic
            await prisma.media.delete({
                where: {
                    id: JSON.parse(userPics.profilePicture as string).id
                }
            })
        }).catch((e: any) => {
            return NextResponse.json({ error: e }, { status: 409 });
        })
    }

    if (fdHeader) {
        // Header
        await uploadFile(fdHeader, MediaType.Header, session.user.id).then(async (mr) => {
            ud.header = mr
            // Delete the old pic
            await prisma.media.delete({
                where: {
                    id: JSON.parse(userPics.header as string).id
                }
            })
        }).catch((e) => {
            return NextResponse.json({ error: e }, { status: 409 });
        })
    }

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

