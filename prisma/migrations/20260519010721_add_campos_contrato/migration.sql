/*
  Warnings:

  - Added the required column `dadosJson` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nicho` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "dadosJson" JSONB NOT NULL,
ADD COLUMN     "nicho" TEXT NOT NULL,
ADD COLUMN     "pdfUrl" TEXT;
