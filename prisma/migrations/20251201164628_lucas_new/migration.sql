/*
  Warnings:

  - The values [EM_ATENDIMENTO,AGENDADO_VISITA] on the enum `ClientStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `propertyId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClientStatus_new" AS ENUM ('PENDENTE_FOLLOWUP', 'EM_NEGOCIACAO', 'COTACAO_SOLICITADA', 'NAO_INTERESSADO', 'REPORTADO');
ALTER TABLE "public"."Client" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Client" ALTER COLUMN "status" TYPE "ClientStatus_new" USING ("status"::text::"ClientStatus_new");
ALTER TYPE "ClientStatus" RENAME TO "ClientStatus_old";
ALTER TYPE "ClientStatus_new" RENAME TO "ClientStatus";
DROP TYPE "public"."ClientStatus_old";
ALTER TABLE "Client" ALTER COLUMN "status" SET DEFAULT 'PENDENTE_FOLLOWUP';
COMMIT;

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_userId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "propertyId",
ADD COLUMN     "productId" TEXT;

-- DropTable
DROP TABLE "Property";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "salesArguments" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
