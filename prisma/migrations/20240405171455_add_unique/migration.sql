/*
  Warnings:

  - A unique constraint covering the columns `[optionId,floor]` on the table `LadderTimePrice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[optionId,weightId]` on the table `SkyTimePrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LadderTimePrice_optionId_floor_key" ON "LadderTimePrice"("optionId", "floor");

-- CreateIndex
CREATE UNIQUE INDEX "SkyTimePrice_optionId_weightId_key" ON "SkyTimePrice"("optionId", "weightId");
