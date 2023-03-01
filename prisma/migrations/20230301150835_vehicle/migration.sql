/*
  Warnings:

  - You are about to drop the column `vehicleTypeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleWeightId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vehicleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vehicleWeightId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vehicleTypeId",
DROP COLUMN "vehicleWeightId";
