"use client";

import { useState } from "react";
import { LayoutGrid, Filter, Download, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { OPCOES_VISIBILIDADE, SECOES_FILTRO, OPCOES_DOWNLOAD } from "../constants/filterOptions";

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-sm font-bold text-gray-700 hover:text-primary transition-colors uppercase tracking-tight"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pb-4 space-y-2 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────
export default function FilterBar() {
  const [menuAberto, setMenuAberto] = useState<"vis" | "filter" | "download" | null>(null);

  const fecharMenus = () => setMenuAberto(null);

  return (
    <div className="relative w-full sm:w-auto">
      {/* Barra de Botões - Altura unificada h-14 com o RegionFilter */}
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1.5 h-14 flex items-center justify-around gap-1.5 min-w-[180px]">
        <button 
          onClick={() => setMenuAberto(menuAberto === "vis" ? null : "vis")}
          title="Visibilidade"
          className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "vis" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setMenuAberto(menuAberto === "filter" ? null : "filter")}
          title="Filtros"
          className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "filter" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setMenuAberto(menuAberto === "download" ? null : "download")}
          title="Exportar"
          className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "download" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Dropdown: Visibilidade dos Gráficos */}
      {menuAberto === "vis" && (
        <div className="absolute top-full right-0 mt-3 w-full sm:w-[450px] bg-white shadow-2xl rounded-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <p className="font-black text-primary uppercase text-[10px] tracking-[0.2em] mb-4">Gerenciar Visibilidade</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {OPCOES_VISIBILIDADE.map(opcao => (
              <label key={opcao.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-primary checked:border-primary transition-all duration-200"
                    defaultChecked 
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 ml-0.5 transition-opacity" />
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">{opcao.texto}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown: Filtros Avançados */}
      {menuAberto === "filter" && (
        <div className="absolute top-full right-0 mt-3 w-full sm:w-[320px] max-h-[75vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">
          <h2 className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-5">Refinar Análise</h2>
          
          <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-xl">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Período de Comparação</span>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Início" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs w-full focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-600" />
              <input type="text" placeholder="Fim" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs w-full focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-600" />
            </div>
          </div>

          <div className="space-y-1">
            {SECOES_FILTRO.map((secao) => (
              <FilterSection key={secao.categoria} title={secao.categoria}>
                {secao.opcoes.map(opcao => (
                  <label key={opcao} className="flex items-center gap-3 cursor-pointer group py-0.5">
                    <input type="checkbox" className="accent-primary w-4 h-4 rounded" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">{opcao}</span>
                  </label>
                ))}
              </FilterSection>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown: Exportação/Download */}
      {menuAberto === "download" && (
        <div className="absolute top-full right-0 mt-3 w-full sm:w-[280px] bg-white shadow-2xl rounded-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <h2 className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">Exportar Dados</h2>
          <p className="text-[11px] text-gray-400 mb-5 font-medium">Selecione o formato para baixar as métricas visualizadas atualmente.</p>
          <div className="space-y-2">
            {OPCOES_DOWNLOAD.map(opcao => (
              <button 
                key={opcao.id} 
                onClick={fecharMenus}
                className="w-full text-left bg-gray-50 hover:bg-primary hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest active:scale-95"
              >
                {opcao.texto}
                <Download className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {menuAberto && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={fecharMenus}
        />
      )}
    </div>
  );
}