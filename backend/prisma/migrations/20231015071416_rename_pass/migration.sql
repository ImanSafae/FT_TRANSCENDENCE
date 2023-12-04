/*
  Warnings:

  - You are about to drop the column `passwords` on the `room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "room" DROP COLUMN "passwords",
ADD COLUMN     "password" TEXT;
