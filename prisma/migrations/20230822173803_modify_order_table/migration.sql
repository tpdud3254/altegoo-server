-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_regionId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "regionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
