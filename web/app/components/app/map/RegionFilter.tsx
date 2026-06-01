"use client";

import { useMapContext } from "../../../contexts/MapContext";
import Switch from "../../basic/Switch";

export default function RegionFilter() {
  const { viewMode, setViewMode } = useMapContext();
  
  const isUfMode = viewMode === "uf";
  const label = isUfMode ? "Visualização por UF" : "Visualização por Região";

  const handleToggle = () => {
    setViewMode(isUfMode ? "regioes" : "uf");
  };

  return (
    <div className="relative w-full md:w-auto" id="region-filter">
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-2 h-14 flex justify-center items-center gap-4 px-6">
        <div className="shrink-0 scale-110">
          <Switch isActive={isUfMode} onToggle={handleToggle} />
        </div>
        <h2 className="text-primary font-black uppercase tracking-tight text-xs sm:text-sm whitespace-nowrap">
          {label}
        </h2>
      </div>
    </div>
  );
}