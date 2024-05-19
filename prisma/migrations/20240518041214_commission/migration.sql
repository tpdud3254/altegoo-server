/*
  Warnings:

  - Made the column `description` on table `Commission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Commission" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "description" SET NOT NULL;
