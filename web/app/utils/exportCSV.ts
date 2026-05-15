"use client";

// Esta função recebe o array específico (UFs ou Regiões) e o nome que o arquivo deve ter
export function exportarCSV(arrayDeDados: any[], nomeArquivo: string) {
  if (!arrayDeDados || arrayDeDados.length === 0) {
    console.warn("Array vazio recebido para CSV.");
    return;
  }
  const cabecalho = Object.keys(arrayDeDados[0]).join(";") + "\n";

  const linhas = arrayDeDados
    .map((linha) => Object.values(linha).join(";"))
    .join("\n");

  const csvCompleto = cabecalho + linhas;

  // Usa a API nativa do navegador para criar o download sem gastar memória do servidor
  const blob = new Blob([csvCompleto], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${nomeArquivo}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}