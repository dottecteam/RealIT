import Link from "next/link";
import ButtonProps from "../types/components/Button";

export function Button({ 
    children, 
    link, 
    bgColor,
    textColor,
    className
}: ButtonProps) {
    return (
        <Link 
            href={link} 
            className={`
                w-full sm:w-auto
                px-5 py-3 sm:px-6 sm:py-2.5
                text-sm sm:text-base
                rounded-full font-bold 
                hover:brightness-110 transition-all active:scale-95 
                shadow-sm flex items-center justify-center gap-2 
                ${bgColor || "bg-secondary"} 
                ${textColor || "text-primary"} 
                ${className || ""}
            `}
        >
            {children}
        </Link>
    );
}