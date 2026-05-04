"use client";

import Link from "next/link";
import NavlinkProps from "../types/components/Navlink";

interface ExtendedNavlinkProps extends NavlinkProps {
    onClick?: () => void;
}

export function Navlink({
    children,
    link,
    color,
    hoverColor,
    className,
    onClick
}: ExtendedNavlinkProps) {
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