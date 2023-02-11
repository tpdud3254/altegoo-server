/*
  Warnings:

  - You are about to drop the column `userId` on the `PointBreakdown` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Region` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PointBreakdown" DROP CONSTRAINT "PointBreakdown_userId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_userId_fkey";

-- AlterTable
ALTER TABLE "PointBreakdown" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_RegionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PointBreakdownToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RegionToUser_AB_unique" ON "_RegionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RegionToUser_B_index" ON "_RegionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PointBreakdownToUser_AB_unique" ON "_PointBreakdownToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PointBreakdownToUser_B_index" ON "_PointBreakdownToUser"("B");

-- AddForeignKey
ALTER TABLE "_RegionToUser" ADD CONSTRAINT "_RegionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegionToUser" ADD CONSTRAINT "_RegionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PointBreakdownToUser" ADD CONSTRAINT "_PointBreakdownToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PointBreakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PointBreakdownToUser" ADD CONSTRAINT "_PointBreakdownToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
