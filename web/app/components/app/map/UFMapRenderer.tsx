"use client";

import { useState } from "react";

import { getViewBoxByUF } from "@/app/constants/map/brasilMapPaths";
import { UF_COLORS } from "@/app/constants/map/mapColors";
export const UFMapRenderer = ({ estado, config }: { estado: any, config: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    const ufColor = UF_COLORS[estado.uf] || config.color;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase">{estado.nome}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${ufColor}20`, color: ufColor }}>
                    {config.label}
                </span>
            </div>

            <svg viewBox={getViewBoxByUF(estado.uf)} className="w-full h-auto">
                <path
                    d={estado.d}
                    fill={isHovered ? ufColor : `${ufColor}25`}
                    stroke={ufColor}
                    strokeWidth={1.2}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="transition-all duration-200 cursor-pointer"
                />
                <text x={estado.centroid[0]} y={estado.centroid[1]} textAnchor="middle" fill={isHovered ? "#fff" : ufColor} className="pointer-events-none font-bold text-[14px]">
                    {estado.uf}
                </text>
            </svg>

            <div className="border-t pt-2 text-xs font-semibold" style={{ color: ufColor }}>
                <span>Cód. IBGE: {estado.codIbge}</span>
            </div>
        </div>
    );
};