"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { getInitials } from "../utils/stringUtils";
import AppHeaderProps from "../types/components/AppHeader";
import { LogOut, ChevronDown } from "lucide-react";
import { api } from "../services/API/api";

export function AppHeader({
   userName = "Usuário",
   userRole = "Membro"
 }: AppHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = getInitials(userName);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Erro ao encerrar sessão no servidor:", error);
    } finally {
      localStorage.removeItem('@RealIT:token');
      localStorage.removeItem('@RealIT:user');
      
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <header className="h-20 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 z-40">
      <div className="flex items-center">
        <Logo color="var(--primary)" size={24} />
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative flex items-center pl-4 sm:pl-6 border-l border-gray-100" ref={dropdownRef}>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-300 text-left cursor-pointer group outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div className="text-right hidden sm:block ml-2">
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                {userName}
              </p>
              <p className="text-xs text-gray-500">
                {userRole}
              </p>
            </div>
            
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20 select-none group-active:scale-95 transition-transform">
              <span className="leading-none">{initials}</span>
            </div>

            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} 
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ease-out origin-top-right">
              
              <div className="px-4 py-2 border-b border-gray-50 mb-2 sm:hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userRole}</p>
              </div>

              <div className="px-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold hover:text-primary bg-transparent rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  <LogOut size={18} />
                  Sair da Conta
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}