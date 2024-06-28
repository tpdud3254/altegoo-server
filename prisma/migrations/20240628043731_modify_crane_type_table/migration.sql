/*
  Warnings:

  - You are about to drop the `craneType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_craneTypeId_fkey";

-- DropTable
DROP TABLE "craneType";

-- CreateTable
CREATE TABLE "CraneType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CraneType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_craneTypeId_fkey" FOREIGN KEY ("craneTypeId") REFERENCES "CraneType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
