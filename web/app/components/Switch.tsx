"use client"

import { useMapContext } from "../contexts/MapContext"

export default function Switch() {
  const { viewMode, setViewMode } = useMapContext()
  const ativo = viewMode === "uf"

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setViewMode(ativo ? "regioes" : "uf")}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
          ${ativo ? "bg-primary" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
            ${ativo ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  )
}