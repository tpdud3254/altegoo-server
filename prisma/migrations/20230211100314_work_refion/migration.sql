/*
  Warnings:

  - You are about to drop the `_RegionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RegionToUser" DROP CONSTRAINT "_RegionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RegionToUser" DROP CONSTRAINT "_RegionToUser_B_fkey";

-- DropTable
DROP TABLE "_RegionToUser";

-- CreateTable
CREATE TABLE "_userWorkRegion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userWorkRegion_AB_unique" ON "_userWorkRegion"("A", "B");

-- CreateIndex
CREATE INDEX "_userWorkRegion_B_index" ON "_userWorkRegion"("B");

-- AddForeignKey
ALTER TABLE "_userWorkRegion" ADD CONSTRAINT "_userWorkRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userWorkRegion" ADD CONSTRAINT "_userWorkRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
