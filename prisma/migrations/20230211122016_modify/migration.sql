/*
  Warnings:

  - You are about to drop the column `orderStatusId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderStatusId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderStatusId";

-- CreateTable
CREATE TABLE "_orderStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_orderStatus_AB_unique" ON "_orderStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_orderStatus_B_index" ON "_orderStatus"("B");

-- AddForeignKey
ALTER TABLE "_orderStatus" ADD CONSTRAINT "_orderStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_orderStatus" ADD CONSTRAINT "_orderStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
