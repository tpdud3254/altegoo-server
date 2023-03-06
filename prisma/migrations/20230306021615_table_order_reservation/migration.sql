-- CreateTable
CREATE TABLE "OrderReservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderReservation" ADD CONSTRAINT "OrderReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderReservation" ADD CONSTRAINT "OrderReservation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
