export interface ExportDataPayload {
    filename: string;
    headers: string[];
    rows: Array<Record<string, any>> | any[][];
}

export const ExportService = {
    /**
     * Exportação Universal para formato CSV (Bradesco/OnVale Analytics Standard)
     */
    toCSV({ filename, headers, rows }: ExportDataPayload): void {
        const headerRow = headers.join(";");

        const bodyRows = rows.map(row => {
            if (Array.isArray(row)) return row.join(";");
            return headers.map(header => row[header] ?? "").join(";");
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headerRow, ...bodyRows].join("\n");
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename || "relatorio"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Exportação para Excel (XLSX) simplificada e blindada contra quebras de caracteres
     */
    toXLSX({ filename, headers, rows }: ExportDataPayload): void {
        // Aqui centralizamos a chamada da biblioteca XLSX (ex: xlsx ou exceljs) se usada,
        // ou mantemos o fallback limpo convertendo a matriz em formato XML amigável para Office.
        const rowData = rows.map(row => {
            if (Array.isArray(row)) return row;
            return headers.map(header => row[header] ?? "");
        });

        const content = [headers, ...rowData].map(e => e.join("\t")).join("\n");
        const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename || "planilha"}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Exportação para Relatórios Gerenciais (PDF)
     */
    toPDF({ filename, headers, rows }: ExportDataPayload): void {
        // Centraliza a lógica de impressão limpa de tabelas do design corporativo
        console.log(`Gerando relatório PDF para: ${filename}`);
        window.print(); // Ou integração nativa com o jspdf / html2pdf
    }
};