"use client";
 
import { createContext, useContext, useState, ReactNode } from "react";
 
export type ViewMode = "regioes" | "uf";
 
interface MapContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}
 
const MapContext = createContext<MapContextType | null>(null);
 
export function MapProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("regioes");
 
  return (
    <MapContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </MapContext.Provider>
  );
}
 
export function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext deve ser usado dentro de MapProvider");
  return ctx;
}
 