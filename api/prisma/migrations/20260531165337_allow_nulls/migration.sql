-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EstruturaIBGE" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "taxa_escolarizacao" REAL,
    "populacao_residente" INTEGER NOT NULL,
    "taxa_crescimento" REAL NOT NULL,
    "variacao_populacao" INTEGER NOT NULL
);
INSERT INTO "new_EstruturaIBGE" ("ano", "id", "populacao_residente", "regiao", "taxa_crescimento", "taxa_escolarizacao", "uf", "variacao_populacao") SELECT "ano", "id", "populacao_residente", "regiao", "taxa_crescimento", "taxa_escolarizacao", "uf", "variacao_populacao" FROM "EstruturaIBGE";
DROP TABLE "EstruturaIBGE";
ALTER TABLE "new_EstruturaIBGE" RENAME TO "EstruturaIBGE";
CREATE TABLE "new_EstruturaSrcPix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano_mes" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "classe" TEXT,
    "metrica" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "valor" REAL NOT NULL
);
INSERT INTO "new_EstruturaSrcPix" ("ano_mes", "classe", "id", "metrica", "origem", "regiao", "tipo", "uf", "valor") SELECT "ano_mes", "classe", "id", "metrica", "origem", "regiao", "tipo", "uf", "valor" FROM "EstruturaSrcPix";
DROP TABLE "EstruturaSrcPix";
ALTER TABLE "new_EstruturaSrcPix" RENAME TO "EstruturaSrcPix";
CREATE TABLE "new_inclusaoExpansao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mesAno" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "maturidadePix" REAL,
    "crescimentoPopulacional" REAL NOT NULL,
    "populacaoAbsoluta" REAL NOT NULL,
    "bonusDemografico" REAL NOT NULL
);
INSERT INTO "new_inclusaoExpansao" ("bonusDemografico", "crescimentoPopulacional", "id", "maturidadePix", "mesAno", "populacaoAbsoluta", "regiao", "uf") SELECT "bonusDemografico", "crescimentoPopulacional", "id", "maturidadePix", "mesAno", "populacaoAbsoluta", "regiao", "uf" FROM "inclusaoExpansao";
DROP TABLE "inclusaoExpansao";
ALTER TABLE "new_inclusaoExpansao" RENAME TO "inclusaoExpansao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
