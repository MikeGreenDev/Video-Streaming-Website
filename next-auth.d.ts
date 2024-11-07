import { Prisma, User } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type IUser = {} & DefaultUser & Prisma.UserGetPayload<{include: {subscribers: true, subscribedTo: true}}>

declare module "next-auth" {
    interface Session {
        user: {
        } & DefaultSession['user'] & IUser
    }

    interface User extends IUser {}
}

declare module "next-auth/jwt" {
    interface JWT extends IUser {
    }
}

