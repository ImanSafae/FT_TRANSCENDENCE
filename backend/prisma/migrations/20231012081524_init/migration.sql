/*
  Warnings:

  - A unique constraint covering the columns `[id42]` on the table `UserData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserData_id42_key" ON "UserData"("id42");
