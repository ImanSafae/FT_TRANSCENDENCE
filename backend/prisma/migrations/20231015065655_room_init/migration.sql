-- AlterTable
ALTER TABLE "UserData" ADD COLUMN     "roomJoined" TEXT[],
ADD COLUMN     "roomOwned" TEXT[];

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "userList" TEXT[],
    "adminList" TEXT[],
    "banList" TEXT[],
    "muteList" TEXT[],
    "private" BOOLEAN NOT NULL DEFAULT false,
    "passwords" TEXT,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_name_key" ON "room"("name");
