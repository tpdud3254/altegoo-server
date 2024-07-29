-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "desc" TEXT;

-- CreateTable
CREATE TABLE "UserRegion" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "desc" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserRegion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRegion" ADD CONSTRAINT "UserRegion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
