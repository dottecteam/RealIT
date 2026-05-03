import { Logo } from "./Logo";
import { getInitials } from "../utils/stringUtils";
import AppHeaderProps from "../types/components/AppHeader";

export function AppHeader({ 
  userName = "Usuário", 
  userRole = "Membro" 
}: AppHeaderProps) {
  
  const initials = getInitials(userName);

  return (
    <header className="h-20 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 z-40">
      <div className="flex items-center">

        <Logo color="var(--primary)" size={24} />
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {userName}
            </p>
            <p className="text-xs text-gray-500">
              {userRole}
            </p>
          </div>
          
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20 select-none">
            <span className="leading-none">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}