/*
  Warnings:

  - A unique constraint covering the columns `[receipt_id]` on the table `VBankOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VBankOrder_receipt_id_key" ON "VBankOrder"("receipt_id");
