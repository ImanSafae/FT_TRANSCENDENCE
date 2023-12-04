/*
  Warnings:

  - You are about to drop the column `muteList` on the `room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pseudo]` on the table `UserData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserData" ADD COLUMN     "friendRequest" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pseudo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "room" DROP COLUMN "muteList";

-- CreateTable
CREATE TABLE "friendsRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,

    CONSTRAINT "friendsRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directMessage" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "u1Score" INTEGER NOT NULL,
    "u2Score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_pseudo_key" ON "UserData"("pseudo");

-- AddForeignKey
ALTER TABLE "directMessage" ADD CONSTRAINT "directMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directMessage" ADD CONSTRAINT "directMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
