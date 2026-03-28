"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-zinc-200 flex flex-col transition-all duration-300 ease-in-out z-50`}
      >
        {/* Topo: Botão de Menu e Logo */}
        <div className="h-20 flex items-center px-4 gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo aparece apenas se estiver aberto */}
          <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
             <span className="font-black text-primary tracking-tighter text-xl whitespace-nowrap">
                REAL <span className="text-secondary-dark">IT</span>
             </span>
          </div>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-grow py-4 px-3 space-y-2">
          <SidebarItem 
            label="Dashboard" 
            isOpen={isSidebarOpen} 
            href="/dashboard" 
            active 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
          />
          <SidebarItem 
            label="Projetos" 
            isOpen={isSidebarOpen} 
            href="/projetos" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
          />
          <SidebarItem 
            label="Arquivos" 
            isOpen={isSidebarOpen} 
            href="/arquivos" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />}
          />
        </nav>

        {/* Rodapé da Sidebar: Configurações */}
        <div className="p-3 border-t border-zinc-100 space-y-2">
          <SidebarItem 
            label="Configurações" 
            isOpen={isSidebarOpen} 
            href="/configuracoes" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
          />
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Superior */}
        <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-end px-8 gap-6 z-40">
          {/* Botão Notificações */}
          <button className="relative p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Perfil */}
          <div className="flex items-center gap-3 pl-6 border-l border-zinc-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-900 leading-tight">Nome do Usuário</p>
              <p className="text-xs text-zinc-500">Membro Premium</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
              NU
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F6F6F6]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, isOpen, href, active }: SidebarItemProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
        active 
        ? "bg-primary text-white shadow-lg shadow-primary/15" 
        : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      <div className="flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      
      <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${
        isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
      }`}>
        {label}
      </span>

      {/* Tooltip simples quando fechado */}
      {!isOpen && (
        <div className="absolute left-20 bg-zinc-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 z-[60]">
          {label}
        </div>
      )}
    </Link>
  );
}