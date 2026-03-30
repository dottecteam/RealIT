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
            className={`px-6 py-2.5 rounded-full font-bold hover:brightness-110 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 ${className || ""}`}
            style={{ 
                backgroundColor: bgColor || "var(--secondary)", // Usa a prop ou a variável CSS do seu tema
                color: textColor || "var(--primary)"           // Usa a prop ou a cor primária do seu tema
            }}
        >
            {children}
        </Link>
    );
}