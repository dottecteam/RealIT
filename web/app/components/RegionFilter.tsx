"use client";
import { useMapContext } from "../contexts/MapContext";
import Switch from "./Switch";

export default function RegionFilter() {
  const { viewMode } = useMapContext();
  return (
    <div className="relative w-full md:w-auto">
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-2 h-14 flex justify-center items-center gap-4 px-6">
        <div className="shrink-0 scale-110">
          <Switch />
        </div>
        <h2 className="text-primary font-black uppercase tracking-tight text-xs sm:text-sm whitespace-nowrap">
          {viewMode === "uf" ? "Visualização por UF" : "Visualização por Região"}
        </h2>
      </div>
    </div>
  );
}