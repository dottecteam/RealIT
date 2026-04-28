"use client"
import { useState } from "react"

interface ChartCardProps {
  title: string
  info?: string
  onClose?: () => void
  children: React.ReactNode
}

export function ChartCard({ title, info, onClose, children }: ChartCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col w-full relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-[#222] pr-4">{title}</h3>

        <div className="flex items-center gap-2 shrink-0">
          {info && (
            <div className="relative">
              <button
                onClick={() => setShowInfo((v) => !v)}
                className="w-6 h-6 rounded-full border border-[#DADADA] flex items-center justify-center text-[#ADADAD] hover:border-[#202AD0] hover:text-[#202AD0] transition-colors text-xs font-bold"
                aria-label="Informação"
              >
                ?
              </button>

              {showInfo && (
                <div className="absolute right-0 top-8 z-50 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-lg p-4 text-sm text-[#555] leading-relaxed">
                  {info}
                  <button
                    onClick={() => setShowInfo(false)}
                    className="mt-3 text-xs text-[#ADADAD] hover:text-[#202AD0] transition-colors block ml-auto"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  )
}