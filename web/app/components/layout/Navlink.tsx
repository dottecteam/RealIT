"use client";

import Link from "next/link";

export default interface NavlinkProps {
    children: React.ReactNode;
    link: string;
    color?: string;
    hoverColor?: string;
    className?: string;
    onClick?: () => void;
}

export function Navlink({
    children,
    link,
    color,
    hoverColor,
    className,
    onClick
}: NavlinkProps) {
    return (
        <Link
            href={link}
            onClick={onClick}
            className={`
                transition-all duration-200 
                flex items-center gap-2 
                group
                ${color || "text-white"} 
                ${hoverColor || "hover:text-secondary"} 
                ${className || ""}
            `}
        >
            <span className="flex items-center gap-2 active:opacity-70">
                {children}
            </span>
        </Link>
    );
}