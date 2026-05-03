"use client";

import { SidebarItem } from "./SidebarItem";
import SidebarProps from "../types/components/Sidebar";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Files, 
  Settings, 
  Menu, 
  ChevronLeft 
} from "lucide-react";

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`
        shadow-xl bg-white z-50 flex
        fixed bottom-0 left-0 w-full h-16 
        flex-row items-center
        border-t border-gray-100

        md:relative md:h-full md:flex-col md:justify-start
        md:border-t-0 md:border-r md:border-gray-200
        md:transition-[width] md:duration-300 md:ease-in-out
        ${isOpen ? "md:w-64" : "md:w-20"}
      `}
    >
      <div className={`hidden md:flex h-20 items-center w-full px-4 ${!isOpen ? "justify-center" : "gap-4"}`}>
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl text-primary transition-all active:scale-90 cursor-pointer" 
        >
          {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && (
          <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <h1 className="font-black text-xl text-primary tracking-tighter">MENU</h1>
          </div>
        )}
      </div>

      <nav className="flex flex-row md:flex-col w-full flex-1 justify-evenly md:justify-start md:py-4 md:px-3 md:space-y-2">
        <SidebarItem 
          label="Dashboard" 
          isOpen={isOpen} 
          href="/dashboard" 
          active
          icon={<LayoutDashboard size={24} />}
        />
        <SidebarItem 
          label="Projetos" 
          isOpen={isOpen} 
          href="/projetos"
          icon={<FolderKanban size={24} />}
        />
        <SidebarItem 
          label="Arquivos" 
          isOpen={isOpen} 
          href="/arquivos"
          icon={<Files size={24} />}
        />

        <div className="md:hidden flex items-center justify-center">
            <SidebarItem 
                label="Configurações" 
                isOpen={false} 
                href="/configuracoes"
                icon={<Settings size={24} />}
            />
        </div>
      </nav>

      <div className="hidden md:block w-full p-3 border-t border-gray-100 mt-auto">
        <SidebarItem 
          label="Configurações" 
          isOpen={isOpen} 
          href="/configuracoes"
          icon={<Settings size={24} />}
        />
      </div>
    </aside>
  );
}