-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "simpleAddress1" TEXT,
ADD COLUMN     "simpleAddress2" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "region1Depth" TEXT,
ADD COLUMN     "region2Depth" TEXT;
