-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "pp" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "FA2" BOOLEAN NOT NULL DEFAULT false,
    "FA2Key" TEXT NOT NULL,
    "blockedUser" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frienList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'onlinee',

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_username_key" ON "UserData"("username");
