-- AlterTable
ALTER TABLE "LadderQuantityPrice" ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "LadderTimePrice" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SkyTimePrice" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
