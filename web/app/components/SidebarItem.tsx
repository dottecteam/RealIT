import Link from "next/link";

import SidebarItemProps from "../types/components/SidebarItem";

export function SidebarItem({ icon, label, isOpen, href, active }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${active
                ? "bg-primary text-white shadow-lg shadow-primary/15"
                : "text-zinc-600 hover:bg-zinc-100"
                }`}
        >
            <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                }`}>
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