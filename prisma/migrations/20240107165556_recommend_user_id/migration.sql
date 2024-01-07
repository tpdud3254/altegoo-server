/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "recommendUserId" SET DEFAULT 1;

-- DropTable
DROP TABLE "Admin";
