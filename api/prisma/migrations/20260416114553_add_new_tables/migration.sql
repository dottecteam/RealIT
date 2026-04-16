/*
  Warnings:

  - You are about to drop the `MediaRegiao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScoreUf` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MediaRegiao_regiao_key";

-- DropIndex
DROP INDEX "ScoreUf_uf_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MediaRegiao";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ScoreUf";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RiscoCredito" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mesAno" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "inadiplenciaReal" REAL NOT NULL,
    "fragilidadeRenda" REAL NOT NULL,
    "agingDivida" REAL NOT NULL,
    "vulnerabilidadeSocial" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "inclusaoExpansao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mesAno" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "maturidadePix" REAL NOT NULL,
    "crescimentoPopulacional" REAL NOT NULL,
    "populacaoAbsoluta" REAL NOT NULL,
    "bonusDemografico" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "FiltroScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUsuario" INTEGER NOT NULL,
    "mesInicial" INTEGER NOT NULL,
    "mesFinal" INTEGER NOT NULL,
    "inadiplenciaRealPeso" REAL NOT NULL,
    "fragilidadeRendaPeso" REAL NOT NULL,
    "agingDividaPeso" REAL NOT NULL,
    "vulnerabilidadeSocialPeso" REAL NOT NULL,
    "maturidadePixPeso" REAL NOT NULL,
    "crescimentoPopulacionalPeso" REAL NOT NULL,
    "populacaoAbsolutaPeso" REAL NOT NULL,
    "bonusDemograficoPeso" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "EstruturaSrcPix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano_mes" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "metrica" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "valor" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "EstruturaIBGE" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "taxa_escolarizacao" REAL NOT NULL,
    "populacao_residente" INTEGER NOT NULL,
    "taxa_crescimento" REAL NOT NULL,
    "variacao_populacao" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
