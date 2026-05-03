"use client";

import { useState } from "react";
import { LayoutGrid, Filter, Download, ChevronDown, ChevronUp, Check } from 'lucide-react';

import { OPCOES_VISIBILIDADE, SECOES_FILTRO, OPCOES_DOWNLOAD } from "../constants/filterOptions";

// ─── Sub-componente de Seção ─────────────────────────────────────────────
function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="pb-3 space-y-2 animate-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────
export default function FilterBar() {
    const [menuAberto, setMenuAberto] = useState<"vis" | "filter" | "download" | null>(null);
    const [filtrosAtivos, setFiltrosAtivos] = useState<Record<string, boolean>>({});

    const toggleFiltro = (id: string) => {
        setFiltrosAtivos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fecharMenus = () => setMenuAberto(null);

    return (
        <div className="relative w-full sm:w-1/2">
            {/* Barra de Botões */}
            <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1.5 h-14 flex items-center justify-around gap-1">
                <button 
                    onClick={() => setMenuAberto(menuAberto === "vis" ? null : "vis")}
                    className={`flex-1 flex items-center justify-center h-full rounded-full transition-all ${menuAberto === "vis" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => setMenuAberto(menuAberto === "filter" ? null : "filter")}
                    className={`flex-1 flex items-center justify-center h-full rounded-full transition-all ${menuAberto === "filter" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Filter className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => setMenuAberto(menuAberto === "download" ? null : "download")}
                    className={`flex-1 flex items-center justify-center h-full rounded-full transition-all ${menuAberto === "download" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Dropdown: Visibilidade */}
            {menuAberto === "vis" && (
                <div className="absolute top-full right-0 mt-3 w-full sm:w-[450px] bg-white shadow-2xl rounded-2xl p-5 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    <p className="font-black text-primary uppercase text-xs tracking-widest mb-4">Visibilidade dos Gráficos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {OPCOES_VISIBILIDADE.map(opcao => (
                            <label key={opcao.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-primary checked:border-primary transition-all"
                                        defaultChecked 
                                    />
                                    <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 ml-0.5 transition-opacity" />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{opcao.texto}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Dropdown: Filtros */}
            {menuAberto === "filter" && (
                <div className="absolute top-full right-0 mt-3 w-full sm:w-[320px] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    <h2 className="text-primary font-black uppercase text-xs tracking-widest mb-4">Filtros Avançados</h2>
                    
                    <div className="mb-6 space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Período</span>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Início" className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs w-full focus:ring-2 focus:ring-primary/20 outline-none" />
                            <input type="text" placeholder="Fim" className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs w-full focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                    </div>

                    {SECOES_FILTRO.map((secao) => (
                        <FilterSection key={secao.categoria} title={secao.categoria}>
                            {secao.opcoes.map(opcao => (
                                <label key={opcao} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="accent-primary w-4 h-4" />
                                    <span className="text-sm text-gray-500 group-hover:text-primary transition-colors">{opcao}</span>
                                </label>
                            ))}
                        </FilterSection>
                    ))}
                </div>
            )}

            {/* Dropdown: Download */}
            {menuAberto === "download" && (
                <div className="absolute top-full right-0 mt-3 w-full sm:w-[280px] bg-white rounded-2xl shadow-2xl p-5 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    <h2 className="text-primary font-black uppercase text-xs tracking-widest mb-2">Exportar Dados</h2>
                    <p className="text-xs text-gray-400 mb-4">Escolha o formato para baixar as análises atuais.</p>
                    <div className="space-y-2">
                        {OPCOES_DOWNLOAD.map(opcao => (
                            <button 
                                key={opcao.id} 
                                onClick={fecharMenus}
                                className="w-full text-left bg-gray-50 hover:bg-primary hover:text-white p-3 rounded-xl text-sm font-bold text-gray-700 transition-all flex items-center justify-between group"
                            >
                                {opcao.texto}
                                <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}