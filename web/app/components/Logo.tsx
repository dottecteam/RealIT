import Link from "next/link";

import LogoProps from "../types/components/Logo"; 

export function Logo({ color = "inherit", size, secondaryColor }: LogoProps) {
    return (
        <Link 
            href="/home" 
            className="font-black tracking-tighter flex items-center"
            style={{ 
                fontSize: size ? `${size}px` : "1.5rem",
                color: color 
            }}
        >
            REAL 
            <span 
                className={secondaryColor ? "" : "text-secondary"} 
                style={{ 
                    color: secondaryColor, 
                    marginLeft: "4px" 
                }}
            >
                IT
            </span>
        </Link>
    );
}