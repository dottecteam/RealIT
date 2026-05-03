"use client";

import { useMapContext } from "../contexts/MapContext";
import Switch from "./Switch";

export default function RegionFilter() {
  const { viewMode } = useMapContext();

  return (
    <div className="relative w-full sm:w-1/2">
      <div className="card-base min-h-[64px] flex justify-center items-center gap-6">
        <div className="shrink-0 scale-110">
          <Switch />
        </div>
        
        <h2 className="text-primary font-black uppercase tracking-tight text-sm sm:text-base">
          {viewMode === "uf" ? "Visualização por UF" : "Visualização por Região"}
        </h2>
      </div>
    </div>
  );
}