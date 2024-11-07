import bcrypt from "bcrypt"
import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prismadb"

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
                    omit: {passwordHash: false},
                    where: { email: credentials.email },
                    include: { subscribers: true, subscribedTo: true }
                });

                if (!user || !user?.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isCorrect = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isCorrect) {
                    throw new Error("Invalid credentials");
                }

                user.passwordHash = "";
                return user;
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, trigger, user }) {
            if (user) {
                user.passwordHash = "";
                token.user = user as any
            }
            if (trigger === 'update') {
                console.log("Updating")
                const sessuser = await getServerSession(authOptions);
                let newUser = await prisma.user.findUnique({
                    where: { email: sessuser?.user.email },
                    include: { subscribers: true, subscribedTo: true },
                });

                token.user = newUser;
            }
            console.log("JWT Callback", { token, user });
            return token;
        },
        async session({ session, token }) {
            if (session?.user) session.user = token.user as any
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

