import Link from "next/link";
import NavlinkProps from "../types/components/Navlink";

export function Navlink({
    children,
    link,
    color = "inherit",
    hoverColor,
    className
}: NavlinkProps) {
    return (
        <Link
            href={link}
            className={`transition-colors flex items-center gap-2 ${className || ""}`}
            style={{
                color: color,
                "--hover-color": hoverColor || "var(--secondary)"
            } as React.CSSProperties}
        >
            <span className={!hoverColor ? "flex gap-2 hover:text-secondary" : ""}>
                {children}
            </span>
        </Link>
    );
}