-- AlterTable
ALTER TABLE "AdminData" ADD COLUMN     "gugupackPrice" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gugupackPrice" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gugupack" BOOLEAN DEFAULT false;
