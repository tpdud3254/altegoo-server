/*
  Warnings:

  - Made the column `finalPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderPoint` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recommendationPoint` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registPoint` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "finalPrice" SET NOT NULL,
ALTER COLUMN "orderPoint" SET NOT NULL,
ALTER COLUMN "orderPrice" SET NOT NULL,
ALTER COLUMN "recommendationPoint" SET NOT NULL,
ALTER COLUMN "registPoint" SET NOT NULL;
