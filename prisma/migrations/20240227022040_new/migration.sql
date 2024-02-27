/*
  Warnings:

  - You are about to drop the column `doneDateTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workingDateTime` on the `Order` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "doneDateTime",
DROP COLUMN "workingDateTime";
