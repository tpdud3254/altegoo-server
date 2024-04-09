/*
  Warnings:

  - Added the required column `receipt_id` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vbank_account` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vbank_code` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vbank_expired_at` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vbank_name` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vbank_tid` to the `VBankOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VBankOrder" ADD COLUMN     "receipt_id" TEXT NOT NULL,
ADD COLUMN     "vbank_account" TEXT NOT NULL,
ADD COLUMN     "vbank_code" TEXT NOT NULL,
ADD COLUMN     "vbank_expired_at" TEXT NOT NULL,
ADD COLUMN     "vbank_name" TEXT NOT NULL,
ADD COLUMN     "vbank_tid" TEXT NOT NULL;
