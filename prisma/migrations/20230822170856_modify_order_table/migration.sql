/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `bothType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `otherAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `otherFloor` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `volumeType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workDateTime` on the `Order` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savePoint` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usePoint` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `address1` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `regionId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `detailAddress1` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_regionId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "bothType",
DROP COLUMN "otherAddress",
DROP COLUMN "otherFloor",
DROP COLUMN "point",
DROP COLUMN "type",
DROP COLUMN "volumeType",
DROP COLUMN "workDateTime",
ADD COLUMN     "dateTime" TEXT NOT NULL,
ADD COLUMN     "direction" TEXT,
ADD COLUMN     "downFloor" INTEGER,
ADD COLUMN     "emergencyPrice" INTEGER,
ADD COLUMN     "savePoint" INTEGER NOT NULL,
ADD COLUMN     "tax" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL,
ADD COLUMN     "upFloor" INTEGER,
ADD COLUMN     "usePoint" INTEGER NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL,
ALTER COLUMN "directPhone" DROP NOT NULL,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "address1" SET NOT NULL,
ALTER COLUMN "regionId" SET NOT NULL,
ALTER COLUMN "detailAddress1" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
