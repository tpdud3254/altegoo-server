-- AlterTable
ALTER TABLE "OrderReservation" ADD COLUMN     "vBankOrderId" INTEGER;

-- CreateTable
CREATE TABLE "VBankOrder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "acceptUser" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "direction" TEXT,
    "floor" TEXT,
    "downFloor" TEXT,
    "upFloor" TEXT,
    "volume" TEXT NOT NULL,
    "time" TEXT,
    "quantity" TEXT,
    "dateTime" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "detailAddress1" TEXT NOT NULL,
    "detailAddress2" TEXT,
    "simpleAddress1" TEXT,
    "simpleAddress2" TEXT,
    "regionId" INTEGER,
    "latitude" TEXT,
    "longitude" TEXT,
    "phone" TEXT NOT NULL,
    "directPhone" TEXT,
    "emergency" BOOLEAN NOT NULL,
    "memo" TEXT,
    "price" INTEGER NOT NULL,
    "emergencyPrice" INTEGER DEFAULT 0,
    "usePoint" INTEGER NOT NULL,
    "orderPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "rPackPrice" INTEGER NOT NULL DEFAULT 0,
    "gugupackPrice" INTEGER NOT NULL DEFAULT 0,
    "tax" INTEGER NOT NULL,
    "finalPrice" INTEGER NOT NULL,
    "recommendationPoint" INTEGER NOT NULL,
    "registPoint" INTEGER NOT NULL,
    "orderPoint" INTEGER NOT NULL,
    "savePoint" INTEGER,
    "orderStatusId" INTEGER NOT NULL,
    "pushStatus" TEXT,

    CONSTRAINT "VBankOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VBankOrder" ADD CONSTRAINT "VBankOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VBankOrder" ADD CONSTRAINT "VBankOrder_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VBankOrder" ADD CONSTRAINT "VBankOrder_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderReservation" ADD CONSTRAINT "OrderReservation_vBankOrderId_fkey" FOREIGN KEY ("vBankOrderId") REFERENCES "VBankOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
