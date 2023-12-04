/*
  Warnings:

  - You are about to drop the column `frienList` on the `UserData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserData" DROP COLUMN "frienList",
ADD COLUMN     "friendList" TEXT[] DEFAULT ARRAY[]::TEXT[];
