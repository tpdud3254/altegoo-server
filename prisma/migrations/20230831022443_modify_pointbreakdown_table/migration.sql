/*
  Warnings:

  - Added the required column `content` to the `PointBreakdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PointBreakdown" ADD COLUMN     "content" TEXT NOT NULL;
