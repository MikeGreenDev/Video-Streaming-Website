import { MediaType, PrismaClient, UserRole } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

const baseProjectRootPath = process.cwd();

async function main() {
    // Delete Everything (This won't delete any files on the system)
    await prisma.$queryRawUnsafe(`Truncate "users" restart identity cascade;`);
    await prisma.$queryRawUnsafe(`Truncate "videos" restart identity cascade;`);
    await prisma.$queryRawUnsafe(`Truncate "medias" restart identity cascade;`);

    const adminPassword = await bcrypt.hash("admin", 12);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            email: 'admin@email.com',
            username: 'admin',
            displayName: 'Admin',
            passwordHash: adminPassword,
            role: UserRole.Admin,
        }
    })
    const adminPfp = await prisma.media.create({
        data: {
            src: `${baseProjectRootPath}/public/uploads/admin.jpg`,
            type: MediaType.ProfilePicture,
            userID: admin.id,
            videoID: null,
        }
    })
    // TODO: Add headers to the seeds
    const adminUpdated = await prisma.user.update({
        where: { id: admin.id },
        data: { profilePicture: adminPfp }
    })

    const johnPassword = await bcrypt.hash("john", 12);
    const john = await prisma.user.upsert({
        where: { username: 'john' },
        update: {},
        create: {
            email: 'john@email.com',
            username: 'john',
            displayName: 'John',
            passwordHash: johnPassword,
        }
    })
    const johnPfp = await prisma.media.create({
        data: {
            src: `${baseProjectRootPath}/public/uploads/john.jpg`,
            type: MediaType.ProfilePicture,
            userID: john.id,
            videoID: null,
        }
    })
    // TODO: Add headers to the seeds
    const johnUpdated = await prisma.user.update({
        where: { id: john.id },
        data: { profilePicture: johnPfp }
    })

    const sarahPassword = await bcrypt.hash("sarah", 12);
    const sarah = await prisma.user.upsert({
        where: { username: 'sarah' },
        update: {},
        create: {
            email: 'sarah@email.com',
            username: 'sarah',
            displayName: 'Sarah',
            passwordHash: sarahPassword,
        }
    })
    const sarahPfp = await prisma.media.create({
        data: {
            src: `${baseProjectRootPath}/public/uploads/sarah.jpg`,
            type: MediaType.ProfilePicture,
            userID: sarah.id,
            videoID: null,
        }
    })
    // TODO: Add headers to the seeds
    const sarahUpdated = await prisma.user.update({
        where: { id: sarah.id },
        data: { profilePicture: sarahPfp }
    })
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})
