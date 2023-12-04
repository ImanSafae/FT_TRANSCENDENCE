-- CreateTable
CREATE TABLE "msgHistory" (
    "id" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,

    CONSTRAINT "msgHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "msgHistory" ADD CONSTRAINT "msgHistory_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "room"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
