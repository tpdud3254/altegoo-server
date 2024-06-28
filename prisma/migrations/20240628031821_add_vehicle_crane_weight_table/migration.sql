-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vehicleCraneWeightId" INTEGER;

-- CreateTable
CREATE TABLE "VehicleCraneWeight" (
    "id" SERIAL NOT NULL,
    "weight" TEXT NOT NULL,

    CONSTRAINT "VehicleCraneWeight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleCraneWeightId_fkey" FOREIGN KEY ("vehicleCraneWeightId") REFERENCES "VehicleCraneWeight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
