import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, username, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash: hashedPassword,
            },
        });
        return NextResponse.json(user);
    } catch (e: any) {
        console.log("ERROR")
        console.log(e)
        if (e instanceof Prisma.PrismaClientKnownRequestError){
            if (e.code === "P2002") {
                if (e.meta?.target == "User_name_key") {
                    console.log("USER ERROR")
                    return NextResponse.json({error: "User Already Taken"}, {status: 500});
                }
            }
        }
    }


}
