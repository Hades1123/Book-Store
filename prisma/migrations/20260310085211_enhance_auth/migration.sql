-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hashRefreshToken" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);
