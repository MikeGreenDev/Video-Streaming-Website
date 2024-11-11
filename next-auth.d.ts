import { Prisma, User } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type IUser = {
    id: string
    email: string
    username: string
    displayName: string
    role: string
    accessToken?: string
} & DefaultUser

declare module "next-auth" {
    interface Session {
        user: {
        } & DefaultSession['user'] & IUser
        expires: string
        error: string
    }

    interface User extends IUser { }
}

declare module "next-auth/jwt" {
    interface JWT extends IUser {
    }
}

