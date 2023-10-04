-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "finalPrice" INTEGER,
ADD COLUMN     "orderPoint" INTEGER,
ADD COLUMN     "orderPrice" INTEGER,
ADD COLUMN     "recommendationPoint" INTEGER,
ADD COLUMN     "registPoint" INTEGER,
ALTER COLUMN "emergencyPrice" SET DEFAULT 0,
ALTER COLUMN "savePoint" DROP NOT NULL;
