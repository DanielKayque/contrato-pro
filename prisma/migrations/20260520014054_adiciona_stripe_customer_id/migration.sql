/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_stripe_customer_id_key" ON "Usuario"("stripe_customer_id");
