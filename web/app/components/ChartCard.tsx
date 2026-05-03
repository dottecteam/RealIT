"use client"
import { useState } from "react"
import { ChartCardProps } from "../types/components/ChartCard"

export function ChartCard({ title, info, children }: ChartCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="card-base flex flex-col w-full relative overflow-visible">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900 pr-4">{title}</h3>

        <div className="flex items-center gap-2 shrink-0">
          {info && (
            <div className="relative">
              <button
                onClick={() => setShowInfo((v) => !v)}
                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors text-xs font-bold"
                aria-label="Informação"
              >
                ?
              </button>

              {showInfo && (
                <div className="absolute right-0 top-8 z-50 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 text-sm text-gray-600 leading-relaxed animate-in fade-in zoom-in duration-200">
                  {info}
                  <button
                    onClick={() => setShowInfo(false)}
                    className="mt-3 text-xs text-gray-400 hover:text-primary transition-colors block ml-auto font-medium"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        {children}
      </div>
    </div>
  )
}