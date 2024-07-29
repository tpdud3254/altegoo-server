/*
  Warnings:

  - You are about to drop the `UserRegion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRegion" DROP CONSTRAINT "UserRegion_userId_fkey";

-- DropTable
DROP TABLE "UserRegion";
