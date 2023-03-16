/*
  Warnings:

  - You are about to drop the column `region1Depth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `region2Depth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "regionId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "region1Depth",
DROP COLUMN "region2Depth";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
