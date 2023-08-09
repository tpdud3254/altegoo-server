-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_vehicleWeightId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vehicleFloorId" INTEGER,
ALTER COLUMN "vehicleWeightId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "VehicleFloor" (
    "id" SERIAL NOT NULL,
    "floor" TEXT NOT NULL,

    CONSTRAINT "VehicleFloor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleFloorId_fkey" FOREIGN KEY ("vehicleFloorId") REFERENCES "VehicleFloor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleWeightId_fkey" FOREIGN KEY ("vehicleWeightId") REFERENCES "VehicleWeight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
