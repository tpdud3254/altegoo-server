-- CreateTable
CREATE TABLE "SubscribeGugupack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscribeGugupack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubscribeGugupack" ADD CONSTRAINT "SubscribeGugupack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
