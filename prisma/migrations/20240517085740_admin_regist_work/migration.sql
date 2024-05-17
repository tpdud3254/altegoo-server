-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentType" INTEGER NOT NULL DEFAULT 0;
