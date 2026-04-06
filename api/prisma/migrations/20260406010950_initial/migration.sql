/*
  Warnings:

  - You are about to drop the `BonusDemografico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrescimentoPopulacional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DadosPix` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InclusaoDemografica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PopulacaoAbsoluta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiscoCredito` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxaEscolarizacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BonusDemografico";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CrescimentoPopulacional";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dados";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DadosPix";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InclusaoDemografica";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PopulacaoAbsoluta";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RiscoCredito";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TaxaEscolarizacao";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ScoreUf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uf" TEXT NOT NULL,
    "score_inadimplencia" REAL,
    "score_fragilidade" REAL,
    "score_aging_divida" REAL,
    "score_escolarizacao" REAL,
    "score_eixo_i" REAL,
    "score_maturidade" REAL,
    "score_crescimento" REAL,
    "score_populacao" REAL,
    "score_eixo_ii" REAL
);

-- CreateTable
CREATE TABLE "MediaRegiao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "regiao" TEXT NOT NULL,
    "media_inadimplencia" REAL,
    "media_fragilidade" REAL,
    "media_aging_divida" REAL,
    "media_escolarizacao" REAL,
    "media_score_eixo_i" REAL,
    "media_maturidade" REAL,
    "media_crescimento" REAL,
    "media_populacao" REAL,
    "media_score_eixo_ii" REAL
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoreUf_uf_key" ON "ScoreUf"("uf");

-- CreateIndex
CREATE UNIQUE INDEX "MediaRegiao_regiao_key" ON "MediaRegiao"("regiao");
