/*
  Warnings:

  - You are about to drop the column `commission` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `onSitePayment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `registDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `registTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sendAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `upDown` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workFloor` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workGrade` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workHeight` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workQuantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `workType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `_orderStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `directPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergency` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderStatusId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `point` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workDateTime` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_orderStatus" DROP CONSTRAINT "_orderStatus_A_fkey";

-- DropForeignKey
ALTER TABLE "_orderStatus" DROP CONSTRAINT "_orderStatus_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "commission",
DROP COLUMN "cost",
DROP COLUMN "onSitePayment",
DROP COLUMN "private",
DROP COLUMN "registDate",
DROP COLUMN "registTime",
DROP COLUMN "sendAddress",
DROP COLUMN "upDown",
DROP COLUMN "workDate",
DROP COLUMN "workFloor",
DROP COLUMN "workGrade",
DROP COLUMN "workHeight",
DROP COLUMN "workQuantity",
DROP COLUMN "workTime",
DROP COLUMN "workType",
ADD COLUMN     "bothType" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "directPhone" TEXT NOT NULL,
ADD COLUMN     "emergency" BOOLEAN NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "orderStatusId" INTEGER NOT NULL,
ADD COLUMN     "otherAddress" TEXT,
ADD COLUMN     "otherFloor" INTEGER,
ADD COLUMN     "point" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" TEXT,
ADD COLUMN     "time" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "vehicleType" TEXT NOT NULL,
ADD COLUMN     "volumeType" TEXT NOT NULL,
ADD COLUMN     "workDateTime" TEXT NOT NULL;

-- DropTable
DROP TABLE "_orderStatus";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
