-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Thumbnail', 'ProfilePicture', 'Video');

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailID" TEXT NOT NULL,
    "mediaID" TEXT NOT NULL,
    "uploaderID" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_uploaderID_fkey" FOREIGN KEY ("uploaderID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
