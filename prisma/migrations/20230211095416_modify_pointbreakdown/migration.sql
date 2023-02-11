/*
  Warnings:

  - You are about to drop the `_PointBreakdownToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PointBreakdownToUser" DROP CONSTRAINT "_PointBreakdownToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PointBreakdownToUser" DROP CONSTRAINT "_PointBreakdownToUser_B_fkey";

-- AlterTable
ALTER TABLE "PointBreakdown" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_PointBreakdownToUser";

-- AddForeignKey
ALTER TABLE "PointBreakdown" ADD CONSTRAINT "PointBreakdown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
