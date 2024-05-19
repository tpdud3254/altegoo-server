/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Commission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Commission_name_key" ON "Commission"("name");
