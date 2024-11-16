import { Prisma } from "@prisma/client";

export type VideoSearchInfo = {

} & Prisma.VideoGetPayload<{
    include: {
        likes: true,
        dislikes: true,
        uploader: {
            select: {
                displayName: true,
                username: true,
                profilePicture: true,
                subCnt: true
            }
        }
    }
}>
