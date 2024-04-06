/*
  Warnings:

  - A unique constraint covering the columns `[optionId,floor]` on the table `LadderQuantityPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LadderQuantityPrice_optionId_floor_key" ON "LadderQuantityPrice"("optionId", "floor");
