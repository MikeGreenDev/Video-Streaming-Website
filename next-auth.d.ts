import { User } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type IUser = {} & DefaultUser & User

declare module "next-auth" {
    interface Session {
        user: {
        } & DefaultSession['user'] & User
    }

    interface User extends IUser {}
}

declare module "next-auth/jwt" {
    interface JWT extends IUser {
    }
}

