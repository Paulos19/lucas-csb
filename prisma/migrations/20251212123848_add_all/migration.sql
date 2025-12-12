/*
  Warnings:

  - You are about to drop the column `ragKnowledgeBase` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('ENTRANTE', 'EM_NEGOCIACAO', 'AGENDADO_COTACAO', 'NAO_INTERESSADO', 'VENDIDO', 'ARQUIVADO');

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_productId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ragKnowledgeBase",
ADD COLUMN     "ragKnowledgeBaseCondensed" JSONB,
ADD COLUMN     "welcomeMessage" TEXT;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Product";

-- DropEnum
DROP TYPE "ClientStatus";

-- CreateTable
CREATE TABLE "InsuranceProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyPremium" DOUBLE PRECISION NOT NULL,
    "coverages" JSONB,
    "assistances" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'ENTRANTE',
    "firstContactSent" BOOLEAN NOT NULL DEFAULT false,
    "dynamicData" JSONB,
    "historicoCompleto" JSONB,
    "resumoDaConversa" TEXT,
    "userId" TEXT NOT NULL,
    "interestedInProductId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'REUNIAO_VENDAS',
    "status" TEXT NOT NULL DEFAULT 'CONFIRMADO',
    "resumo" TEXT,
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_contato_key" ON "Lead"("contato");

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_leadId_key" ON "Agendamento"("leadId");

-- AddForeignKey
ALTER TABLE "InsuranceProduct" ADD CONSTRAINT "InsuranceProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_interestedInProductId_fkey" FOREIGN KEY ("interestedInProductId") REFERENCES "InsuranceProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
