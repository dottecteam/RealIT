"use client";

import { BRASIL_PATHS } from "@/app/constants/map/brasilMapPaths";
import { UF_COLORS } from "@/app/constants/map/mapColors";

interface UFSelectButtonsProps {
    active: string;
    onSelect: (uf: string) => void;
}

const formatarNome = (nome: string) => {
    const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e"];
    return nome.toLowerCase().split(" ").map((palavra, index) => {
        if (index > 0 && palavrasMinusculas.includes(palavra)) return palavra;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(" ");
};

export function UFSelectButtons({ active, onSelect }: UFSelectButtonsProps) {
    return (
        <>
            {[...BRASIL_PATHS].sort((a, b) => a.nome.localeCompare(b.nome)).map((estado) => {
                const color = UF_COLORS[estado.uf] || "#64748b";
                const isActive = active === estado.uf;
                return (
                    <button
                        key={estado.uf}
                        onClick={() => onSelect(estado.uf)}
                        className="transition-all duration-150 rounded-full px-3 py-1 text-xs font-semibold border"
                        style={{
                            background: isActive ? color : "#fff",
                            color: isActive ? "#fff" : "#64748b",
                            borderColor: isActive ? color : "#e2e8f0",
                            boxShadow: isActive ? `0 4px 12px ${color}40` : undefined,
                            transform: isActive ? "translateY(-1px)" : undefined,
                        }}
                    >
                        {formatarNome(estado.nome)}
                    </button>
                );
            })}
        </>
    );
}