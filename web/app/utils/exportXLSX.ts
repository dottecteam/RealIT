"use client";

import { mockDadosScoreCompleto } from "../mocks/score";

export async function exportarXLSX() {
  const { dadosScore, dadosMediaRegiao } = mockDadosScoreCompleto;

  if (!dadosScore || !dadosMediaRegiao) {
    console.error("Dados incompletos para exportação.");
    return;
  }

  try {
    // Importação dinâmica
    const XLSX = await import("xlsx");
    const abaEstados = XLSX.utils.json_to_sheet(dadosScore);
    const abaRegioes = XLSX.utils.json_to_sheet(dadosMediaRegiao);
    const arquivoExcel = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(arquivoExcel, abaEstados, "Scores por UF");
    XLSX.utils.book_append_sheet(arquivoExcel, abaRegioes, "Médias Regionais");

    XLSX.writeFile(arquivoExcel, "Relatorio_Inteligencia_Geografica.xlsx");

  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
  }
}