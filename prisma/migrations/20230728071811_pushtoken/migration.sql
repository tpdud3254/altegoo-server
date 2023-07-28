/*
  Warnings:

  - Made the column `code` on table `WorkCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pushToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkCategory" ALTER COLUMN "code" SET NOT NULL;
