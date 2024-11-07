import { Prisma, PrismaClient } from "@prisma/client";

//const omitObj: Prisma.Subset = { omit: { user: { passwordHash: true } } }

declare global {
    var prisma: PrismaClient<any> | undefined;
}

const client = globalThis.prisma || new PrismaClient({ omit: { user: { passwordHash: true } } });

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;

