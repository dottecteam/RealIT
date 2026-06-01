import Link from "next/link";

interface LogoProps {
    color?: string;
    secondaryColor?: string;
    size?: number;
}

export function Logo({ color, size, secondaryColor }: LogoProps) {
    return (
        <Link
            href="/"
            className="font-black tracking-tighter flex items-center transition-opacity hover:opacity-90"
            style={{
                fontSize: size ? `${size}px` : "1.5rem"
            }}
        >
            <span
                className={color ? "" : "text-primary"}
                style={{ color: color }}
            >
                REAL
            </span>
            <span
                className={`ml-1 ${secondaryColor ? "" : "text-secondary"}`}
                style={{ color: secondaryColor }}
            >
                IT
            </span>
        </Link>
    );
}