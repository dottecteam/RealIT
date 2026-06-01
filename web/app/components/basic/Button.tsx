"use client";

import Link from "next/link";

interface ButtonProps {
    children: React.ReactNode;
    link?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    bgColor?: string;
    textColor?: string;
    className?: string;
}

export function Button({
    children,
    link,
    type = "button",
    disabled,
    onClick,
    bgColor,
    textColor,
    className
}: ButtonProps) {
    const baseStyles = `
    w-full sm:w-auto
    px-5 py-3 sm:px-6 sm:py-2.5
    text-sm sm:text-base
    rounded-full font-bold 
    hover:brightness-110 transition-all active:scale-95 
    shadow-sm flex items-center justify-center gap-2 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    ${bgColor || "bg-secondary"} 
    ${textColor || "text-primary"} 
    ${className || ""}
  `;

    if (link) {
        return (
            <Link href={link} className={baseStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={baseStyles}
        >
            {children}
        </button>
    );
}