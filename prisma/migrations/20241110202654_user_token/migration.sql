/*
  Warnings:

  - You are about to drop the column `dislikes` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `mediaID` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailID` on the `videos` table. All the data in the column will be lost.
  - Added the required column `userID` to the `medias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoVisibility" AS ENUM ('Private', 'Hidden', 'Public');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Private', 'Hidden', 'Public');

-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'Header';

-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "userID" TEXT NOT NULL,
ADD COLUMN     "videoID" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "header" JSONB,
ADD COLUMN     "profilePicture" JSONB,
ADD COLUMN     "subCnt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'Public';

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "dislikes",
DROP COLUMN "likes",
DROP COLUMN "mediaID",
DROP COLUMN "thumbnailID",
ADD COLUMN     "media" JSONB,
ADD COLUMN     "tags" TEXT NOT NULL,
ADD COLUMN     "thumbnail" JSONB,
ADD COLUMN     "visibility" "VideoVisibility" NOT NULL DEFAULT 'Private';

-- CreateTable
CREATE TABLE "_UserSubscribers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Likes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Dislikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSubscribers_AB_unique" ON "_UserSubscribers"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSubscribers_B_index" ON "_UserSubscribers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Likes_AB_unique" ON "_Likes"("A", "B");

-- CreateIndex
CREATE INDEX "_Likes_B_index" ON "_Likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Dislikes_AB_unique" ON "_Dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_Dislikes_B_index" ON "_Dislikes"("B");

-- AddForeignKey
ALTER TABLE "_UserSubscribers" ADD CONSTRAINT "_UserSubscribers_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSubscribers" ADD CONSTRAINT "_UserSubscribers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Dislikes" ADD CONSTRAINT "_Dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Dislikes" ADD CONSTRAINT "_Dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
