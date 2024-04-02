-- AlterTable
ALTER TABLE "AdminData" ADD COLUMN     "r_packPrice" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "r_pack" BOOLEAN DEFAULT false;
