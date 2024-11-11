import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    const body = await request.json();
    let { email, username, password }: {email: string, username: string, password: string} = body;
    email = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                username: username.toLowerCase(),
                displayName: username,
                passwordHash: hashedPassword,
            },
        });
        return NextResponse.json(user);
    } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError){
            if (e.code === "P2002") {
                if (e.meta?.target[0] == "username") {
                    return NextResponse.json({error: "Username Already Taken"}, {status: 500});
                }
                if (e.meta?.target[0] == "email") {
                    return NextResponse.json({error: "Email Already Taken"}, {status: 500});
                }
            }
        }
        return NextResponse.json({error: "Unknown Error"}, {status: 500});
    }
}
