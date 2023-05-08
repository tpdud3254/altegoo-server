-- CreateTable
CREATE TABLE "Notice" (
    "id" SERIAL NOT NULL,
    "managerId" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "performance" TEXT,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
