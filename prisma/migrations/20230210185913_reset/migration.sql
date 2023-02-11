-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userTypeId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth" TEXT NOT NULL,
    "license" TEXT,
    "vehicleNumber" TEXT,
    "vehicleWeightId" INTEGER,
    "vehicleTypeId" INTEGER,
    "recommendUserId" INTEGER,
    "gender" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "accessedRegion" TEXT,
    "sms" BOOLEAN NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "pointId" INTEGER NOT NULL,
    "avatar" TEXT,
    "withdrawalDate" TIMESTAMP(3),
    "greeting" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" SERIAL NOT NULL,
    "curPoint" INTEGER NOT NULL,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bank" TEXT,
    "accruedPoint" INTEGER NOT NULL DEFAULT 0,
    "withdrawalPoint" INTEGER NOT NULL DEFAULT 0,
    "subtractPoint" INTEGER NOT NULL DEFAULT 0,
    "addPoint" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointBreakdown" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "memo" TEXT,
    "userId" INTEGER,

    CONSTRAINT "PointBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "acceptUser" INTEGER,
    "registDate" TEXT NOT NULL,
    "registTime" TEXT NOT NULL,
    "workDate" TEXT NOT NULL,
    "workTime" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "workHeight" TEXT NOT NULL,
    "workFloor" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "workQuantity" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "sendAddress" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "memo" TEXT,
    "orderStatusId" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL,
    "workGrade" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" SERIAL NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTheme" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleWeight" (
    "id" SERIAL NOT NULL,
    "weight" TEXT NOT NULL,

    CONSTRAINT "VehicleWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "managerId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vehicleWeightId_fkey" FOREIGN KEY ("vehicleWeightId") REFERENCES "VehicleWeight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointBreakdown" ADD CONSTRAINT "PointBreakdown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
