/*
  Warnings:

  - You are about to alter the column `carteira_inadiplencia` on the `Dados` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to drop the column `qt_pes_recebedor_pf` on the `DadosPix` table. All the data in the column will be lost.
  - You are about to drop the column `qt_recebedor_pf` on the `DadosPix` table. All the data in the column will be lost.
  - You are about to drop the column `vl_recebedor_pf` on the `DadosPix` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RiscoCredito" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inadimplenciaReal" REAL NOT NULL,
    "FragilidadeRenda" REAL NOT NULL,
    "AgingDivida" REAL NOT NULL,
    "VulnerabilidadeSocial" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "InclusaoDemografica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MaturidadePix" REAL NOT NULL,
    "CrescimentoPopulacional" REAL NOT NULL,
    "PopulacaoAbsoluta" INTEGER NOT NULL,
    "BonusDemografico" REAL NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BonusDemografico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brasilGrandeRegiaoUf" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "xy_anos" TEXT NOT NULL
);
INSERT INTO "new_BonusDemografico" ("brasilGrandeRegiaoUf", "id", "total", "xy_anos") SELECT "brasilGrandeRegiaoUf", "id", "total", "xy_anos" FROM "BonusDemografico";
DROP TABLE "BonusDemografico";
ALTER TABLE "new_BonusDemografico" RENAME TO "BonusDemografico";
CREATE TABLE "new_Dados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_base" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "cnae_ocupacao" TEXT NOT NULL,
    "porte" TEXT NOT NULL,
    "carteira_inadiplencia" REAL NOT NULL,
    "carteira_vencida" REAL NOT NULL DEFAULT 0,
    "carteira_ativa" REAL NOT NULL DEFAULT 0,
    "carteira_acima_de_90_dias" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Dados" ("carteira_inadiplencia", "carteira_vencida", "cliente", "cnae_ocupacao", "data_base", "id", "porte", "uf") SELECT "carteira_inadiplencia", coalesce("carteira_vencida", 0) AS "carteira_vencida", "cliente", "cnae_ocupacao", "data_base", "id", "porte", "uf" FROM "Dados";
DROP TABLE "Dados";
ALTER TABLE "new_Dados" RENAME TO "Dados";
CREATE TABLE "new_DadosPix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano_mes" INTEGER NOT NULL,
    "municipio_ibge" INTEGER NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado_ibge" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "sigla_regiao" TEXT NOT NULL,
    "vl_pagador_pf" REAL NOT NULL,
    "qt_pagador_pf" INTEGER NOT NULL,
    "qt_pes_pagador_pf" INTEGER NOT NULL
);
INSERT INTO "new_DadosPix" ("ano_mes", "estado", "estado_ibge", "id", "municipio", "municipio_ibge", "qt_pagador_pf", "qt_pes_pagador_pf", "sigla_regiao", "vl_pagador_pf") SELECT "ano_mes", "estado", "estado_ibge", "id", "municipio", "municipio_ibge", "qt_pagador_pf", "qt_pes_pagador_pf", "sigla_regiao", "vl_pagador_pf" FROM "DadosPix";
DROP TABLE "DadosPix";
ALTER TABLE "new_DadosPix" RENAME TO "DadosPix";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
