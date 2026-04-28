import { SidebarItem } from "./SidebarItem";

import SidebarProps from "../types/components/Sidebar";
import { Logo } from "./Logo";

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`
        shadow-md bg-white z-50 flex

        fixed bottom-0 left-0 w-full h-16 
        flex-row items-center justify-around 
        border-t border-zinc-200

        md:relative md:h-full md:flex-col md:justify-start
        md:border-t-0 md:border-r

        md:transition-[width] md:duration-300 md:ease-in-out

        ${isOpen ? "md:w-64" : "md:w-20"}
      `}
    >
      <div className="hidden md:flex h-20 items-center px-4 gap-4">
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors" 
          title={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
          {/* <Logo color="var(--primary)" secondaryColor="var(--primary)"/> */}
          <h1 className="font-bold text-xl text-[#202AD0] text-5x1">MENU</h1>
        </div>
      </div>

      <nav className="flex flex-row md:flex-col w-full justify-around md:justify-start md:py-4 md:px-3 md:space-y-2">
        <SidebarItem label="Dashboard" isOpen={isOpen} href="/dashboard" active
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
        />
        <SidebarItem label="Projetos" isOpen={isOpen} href="/projetos"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
        />
        <SidebarItem label="Arquivos" isOpen={isOpen} href="/arquivos"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />}
        />
      </nav>

      <div className="p-3 border-t border-zinc-100 space-y-2">
        <SidebarItem label="Configurações" isOpen={isOpen} href="/configuracoes"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
        />
      </div>
    </aside>
  );
}