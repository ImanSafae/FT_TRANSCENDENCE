/*
  Warnings:

  - Added the required column `id42` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserData" ADD COLUMN     "id42" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'online';
