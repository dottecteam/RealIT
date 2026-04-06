-- AlterTable
ALTER TABLE "Dados" ADD COLUMN "carteira_vencida" REAL;

-- CreateTable
CREATE TABLE "TaxaEscolarizacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nn" TEXT NOT NULL,
    "v" REAL NOT NULL,
    "d1n" TEXT NOT NULL,
    "d3n" INTEGER NOT NULL,
    "d5n" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CrescimentoPopulacional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "d1n" TEXT NOT NULL,
    "d2n" TEXT NOT NULL,
    "v" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "PopulacaoAbsoluta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "d1n" TEXT NOT NULL,
    "d2n" TEXT NOT NULL,
    "v" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "BonusDemografico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brasilGrandeRegiaoUf" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "xy_anos" INTEGER NOT NULL
);
