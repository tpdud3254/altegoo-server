/*
  Warnings:

  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `UserType` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `UserType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId",
DROP COLUMN "userName",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyPersonName" TEXT,
ADD COLUMN     "userNumber" TEXT,
ADD COLUMN     "workCategoryId" INTEGER,
ALTER COLUMN "pushToken" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserType" DROP COLUMN "category",
DROP COLUMN "code";

-- CreateTable
CREATE TABLE "WorkCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "WorkCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workCategoryId_fkey" FOREIGN KEY ("workCategoryId") REFERENCES "WorkCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
