import bcrypt from "bcrypt"
import NextAuth, { AuthOptions, getServerSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prismadb"
import { cookies } from "next/headers";
import { createAccessToken } from "@/lib/jwt";

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
                    omit: { passwordHash: false },
                    where: { email: credentials.email }
                });

                if (!user || !user?.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isCorrect = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isCorrect) {
                    throw new Error("Invalid credentials");
                }

                cookies().set({
                    name: 'refresh-token',
                    value: cookies().get('refresh-token')?.value || "",
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true
                })
                const at = createAccessToken(user)
                const retUser: User = {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    email: user.email,
                    accessToken: at,
                    role: user.role
                }
                return retUser;
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            if (user && account) {
                token.id = user.id
                token.accessToken = user.accessToken
                token.email = user.email
                token.username = user.username
                token.displayName = user.displayName
                token.role = user.role
            }

            if (trigger === "update") {
                // NOTE: If in the future we don't need full db fetch updates everytime. We can use `session` to pass a string to choose different types of updates
                const newUser = await prisma.user.findUnique({
                    omit: { passwordHash: false },
                    where: { id: token.id }
                });
                token = { ...token, ...newUser }
            }

            //console.log("JWT Callback", { token, user, account, trigger, session });
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    username: token.username,
                    displayName: token.displayName,
                    accessToken: token.accessToken as string,
                    role: token.role
                },
                error: ""
            }
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

