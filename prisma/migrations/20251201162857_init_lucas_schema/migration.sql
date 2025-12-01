/*
  Warnings:

  - You are about to drop the column `lastContactDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `nextFollowUpDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `productSold` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `saleDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Client` table. All the data in the column will be lost.
  - The `status` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('PENDENTE_FOLLOWUP', 'EM_ATENDIMENTO', 'AGENDADO_VISITA', 'NAO_INTERESSADO', 'REPORTADO');

-- DropIndex
DROP INDEX "Client_whatsapp_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "lastContactDate",
DROP COLUMN "nextFollowUpDate",
DROP COLUMN "productSold",
DROP COLUMN "saleDate",
DROP COLUMN "whatsapp",
ADD COLUMN     "history" JSONB,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "propertyId" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ClientStatus" NOT NULL DEFAULT 'PENDENTE_FOLLOWUP';

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "FollowUpStatus";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "ragKnowledgeBase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "features" JSONB,
    "propertyRAG" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
