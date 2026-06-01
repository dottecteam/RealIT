"use client";

import { useState } from "react";
import { LayoutGrid, Filter, Download } from 'lucide-react';
import { ExportService } from "@/app/services/Export/exportService";
import { useClickOutside } from "@/app/hooks/useClickOutside";

interface FilterBarProps {
  dataToExport: any;
}

export default function FilterBar({ dataToExport }: FilterBarProps) {
  const [menuAberto, setMenuAberto] = useState<"vis" | "filter" | "download" | null>(null);
  const containerRef = useClickOutside(() => setMenuAberto(null));

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto" id="filter-bar">
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1.5 h-14 flex items-center justify-around gap-1.5 min-w-[180px]">
        <IconButton icon={<LayoutGrid />} active={menuAberto === "vis"} onClick={() => setMenuAberto(menuAberto === "vis" ? null : "vis")} />
        <IconButton icon={<Filter />} active={menuAberto === "filter"} onClick={() => setMenuAberto(menuAberto === "filter" ? null : "filter")} />
        <IconButton icon={<Download />} active={menuAberto === "download"} onClick={() => setMenuAberto(menuAberto === "download" ? null : "download")} />
      </div>

      {menuAberto === "download" && (
        <div className="absolute top-full right-0 mt-3 w-full sm:w-[280px] bg-white shadow-2xl rounded-2xl p-6 z-[9999] border border-gray-100">
          <h2 className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-5">Exportar Dados</h2>
          <div className="space-y-2">
            <ExportButton label="DOWNLOAD EM PDF" onClick={() => ExportService.toPDF({ filename: "relatorio", headers: [], rows: dataToExport })} />
            <ExportButton label="DOWNLOAD EM EXCEL" onClick={() => ExportService.toXLSX({ filename: "dados", headers: [], rows: dataToExport })} />
            <ExportButton label="CSV - POR ESTADO" onClick={() => ExportService.toCSV({ filename: "estados", headers: ["uf", "valor"], rows: dataToExport })} />
          </div>
        </div>
      )}
    </div>
  );
}

const IconButton = ({ icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${active ? "bg-primary text-white shadow-md" : "text-gray-400 hover:bg-gray-50 hover:text-primary"
      }`}
  >
    {icon}
  </button>
);

const ExportButton = ({ label, onClick }: { label: string, onClick: (e: any) => void }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(e); }}
    className="w-full text-left bg-gray-50 hover:bg-primary hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest"
  >
    {label}
    <Download className="w-4 h-4" />
  </button>
);