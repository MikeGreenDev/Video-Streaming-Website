import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prismadb"
import { UserRole } from "@prisma/client";


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user?.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isCorrect = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isCorrect) {
                    throw new Error("Invalid credentials");
                }

                console.log("USERRRRRRRRRRRRRRRRR")
                console.log(user)

                return user;
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            console.log("JWT Callback", { token, user });
            return token;
        },
        async session ({ session, token }) {
            if (session?.user) session.user.role = token.role as UserRole
            console.log("Session Callback", { session, token });
            return session
        },
    },
    debug: process.env.NODE_ENV !== "production",
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }


