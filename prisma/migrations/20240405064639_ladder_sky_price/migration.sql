-- CreateTable
CREATE TABLE "LadderQuantityOption" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "LadderQuantityOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LadderQuantityPrice" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "LadderQuantityPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LadderTimeOption" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "LadderTimeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LadderTimePrice" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "LadderTimePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkyTimeOption" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "SkyTimeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkyTimePrice" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "SkyTimePrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LadderQuantityPrice" ADD CONSTRAINT "LadderQuantityPrice_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "LadderQuantityOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LadderTimePrice" ADD CONSTRAINT "LadderTimePrice_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "LadderTimeOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkyTimePrice" ADD CONSTRAINT "SkyTimePrice_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "SkyTimeOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
