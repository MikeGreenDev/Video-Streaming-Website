-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Mod', 'Admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'User';
