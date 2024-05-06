-- AlterTable
ALTER TABLE "VBankOrder" ADD COLUMN     "driverId" INTEGER,
ADD COLUMN     "isDesignation" BOOLEAN NOT NULL DEFAULT false;
