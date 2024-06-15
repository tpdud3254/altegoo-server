/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `bank` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankAccountName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankAccountNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telecomId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "email",
DROP COLUMN "gender",
DROP COLUMN "phone",
DROP COLUMN "position",
ADD COLUMN     "bank" TEXT NOT NULL,
ADD COLUMN     "bankAccountName" TEXT NOT NULL,
ADD COLUMN     "bankAccountNumber" TEXT NOT NULL,
ADD COLUMN     "idNumber" TEXT NOT NULL,
ADD COLUMN     "permission" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "positionId" INTEGER NOT NULL,
ADD COLUMN     "telecomId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Telecom" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Telecom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPosition" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "AdminPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_telecomId_fkey" FOREIGN KEY ("telecomId") REFERENCES "Telecom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "AdminPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
