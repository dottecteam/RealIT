-- CreateTable
CREATE TABLE "Dados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_base" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "cnae_ocupacao" TEXT NOT NULL,
    "porte" TEXT NOT NULL,
    "carteira_inadiplencia" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DadosPix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano_mes" INTEGER NOT NULL,
    "municipio_ibge" INTEGER NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado_ibge" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "sigla_regiao" TEXT NOT NULL,
    "vl_pagador_pf" REAL NOT NULL,
    "qt_pagador_pf" INTEGER NOT NULL,
    "vl_recebedor_pf" REAL NOT NULL,
    "qt_recebedor_pf" INTEGER NOT NULL,
    "qt_pes_pagador_pf" INTEGER NOT NULL,
    "qt_pes_recebedor_pf" INTEGER NOT NULL
);
