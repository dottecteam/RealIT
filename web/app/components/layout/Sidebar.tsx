"use client";

import { ChevronLeft, Menu, User } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { ROUTES } from "../../constants/routes";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("@RealIT:user") || "{}")
    : null;
  const mainRoutes = ROUTES.appRoutesList
    .slice(0, -1)
    .filter((route) => {
      if (route.href === "/app/funcionarios") {
        return user?.role === "ADMIN";
      }

      return true;
    });
  const settingsRoute = ROUTES.APP.PERFIL;
  const pathname = usePathname();

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
      {/* Header */}
      <div
        className={`
          hidden md:flex h-20 items-center w-full px-4
          ${!isOpen ? "justify-center" : "gap-4"}
        `}
      >
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl text-primary transition-all active:scale-90 cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <h1 className="font-black text-xl text-primary tracking-tighter">
              MENU
            </h1>
          </div>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex flex-row md:flex-col w-full flex-1 justify-evenly md:justify-start md:py-4 md:px-3 md:space-y-2">
        {mainRoutes.map((route, index) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <SidebarItem
              key={index}
              label={route.label}
              isOpen={isOpen}
              href={route.href}
              icon={<Icon size={24} />}
              active={isActive}
            />
          );
        })}

        {/* Mobile profile */}
        <div className="md:hidden flex items-center justify-center">
          {settingsRoute && (
            <SidebarItem
              label="Perfil"
              isOpen={false}
              href={settingsRoute.href}
              icon={<User size={24} />}
              active={pathname === settingsRoute.href}
            />
          )}
        </div>
      </nav>

      {/* Desktop profile */}
      {settingsRoute && (
        <div className="hidden md:block w-full p-3 border-t border-gray-100 mt-auto">
          <SidebarItem
            label="Perfil"
            isOpen={isOpen}
            href={settingsRoute.href}
            icon={<User size={24} />}
            active={pathname === settingsRoute.href}
          />
        </div>
      )}
    </aside>
  );
}