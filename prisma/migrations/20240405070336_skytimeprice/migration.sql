/*
  Warnings:

  - Added the required column `floor` to the `LadderQuantityPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `LadderTimePrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightId` to the `SkyTimePrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LadderQuantityPrice" ADD COLUMN     "floor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LadderTimePrice" ADD COLUMN     "floor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SkyTimePrice" ADD COLUMN     "weightId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SkyTimeWeight" (
    "id" SERIAL NOT NULL,
    "weightTitle" TEXT NOT NULL,

    CONSTRAINT "SkyTimeWeight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkyTimePrice" ADD CONSTRAINT "SkyTimePrice_weightId_fkey" FOREIGN KEY ("weightId") REFERENCES "SkyTimeWeight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
