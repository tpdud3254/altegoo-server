/*
  Warnings:

  - You are about to drop the column `datailAddress1` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `datailAddress2` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "datailAddress1",
DROP COLUMN "datailAddress2",
ADD COLUMN     "detailAddress1" TEXT,
ADD COLUMN     "detailAddress2" TEXT;
