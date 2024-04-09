/*
  Warnings:

  - You are about to drop the column `url` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "url",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "link" TEXT;
