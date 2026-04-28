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

                ${active
                ? "text-primary md:bg-primary md:text-white md:shadow-lg md:shadow-primary/15"
                : "text-zinc-600 hover:bg-zinc-100"}
            `}
        >
            <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <span
            className={`
                text-[10px] md:text-sm font-medium
                transition-all duration-200
                ${isOpen ? "md:opacity-100 md:w-auto" : "md:opacity-0 md:w-0 md:hidden"}
            `}
            >
            {label}
            </span>
            {!isOpen && (
                <div className="absolute left-20 bg-zinc-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 z-[60]">
                    {label}
                </div>
            )}
        </Link>
    );
}