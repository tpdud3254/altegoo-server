-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "craneTypeId" INTEGER;

-- CreateTable
CREATE TABLE "craneType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "craneType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_craneTypeId_fkey" FOREIGN KEY ("craneTypeId") REFERENCES "craneType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
