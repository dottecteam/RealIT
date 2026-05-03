"use client";

import Link from "next/link";
import SidebarItemProps from "../types/components/SidebarItem";

export function SidebarItem({ icon, label, isOpen, href, active }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={`
                relative
                flex flex-col md:flex-row items-center justify-center
                gap-1 md:gap-4
                p-2 md:p-3
                rounded-xl
                transition-all group
                /* 1. Cores e sombras agora usam as variáveis do sistema */
                ${active
                ? "text-primary md:bg-primary md:text-white md:shadow-lg md:shadow-primary/20"
                : "text-gray-500 hover:bg-gray-100 hover:text-primary"}
            `}
        >
            <div className="flex-shrink-0 flex items-center justify-center">
                {icon}
            </div>

            <span
                className={`
                    text-[10px] md:text-sm font-bold
                    transition-all duration-300
                    /* 3. Ajuste de visibilidade para evitar quebra de layout */
                    ${isOpen ? "md:opacity-100 md:translate-x-0" : "md:opacity-0 md:-translate-x-4 md:hidden"}
                `}
            >
                {label}
            </span>

            {!isOpen && (
                <div className="hidden md:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 z-[100] whitespace-nowrap shadow-xl">
                    {label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
            )}
        </Link>
    );
}