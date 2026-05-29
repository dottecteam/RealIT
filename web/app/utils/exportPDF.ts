export async function exportarPDF() {
  const elemento = document.getElementById("export-pdf");

  if (!elemento) {
    console.error("Elemento do dashboard não encontrado.");
    return;
  }

  try {
    //Importação Dinâmica: Só baixa e executa as libs quando a função é chamada
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true, 
      logging: false, // Desliga os logs extensos do html2canvas no console
      ignoreElements: (element) => {
        const idsOcultos = ["filter-bar", "region-filter", "mapa-calor"];
        if (idsOcultos.includes(element.id)) {
            return true; 
        }
        return false;
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("dashboard.pdf");
  } catch (error) {
    console.error("Erro fatal ao gerar o PDF:", error);
  }
}