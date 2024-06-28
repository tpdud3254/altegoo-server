/*
  Warnings:

  - Added the required column `craneTypeId` to the `VehicleCraneWeight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleCraneWeight" ADD COLUMN     "craneTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "VehicleCraneWeight" ADD CONSTRAINT "VehicleCraneWeight_craneTypeId_fkey" FOREIGN KEY ("craneTypeId") REFERENCES "CraneType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
