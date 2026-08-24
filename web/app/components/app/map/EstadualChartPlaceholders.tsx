"use client";

export function EstadualChartPlaceholders() {
    const charts = [
        "Maturidade Pix",
        "Composição de Carteira por Classe Social",
        "Evolução da Carteira Ativa e Inadimplência",
    ];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {charts.slice(0, 2).map((title) => (
                    <div key={title} className="card-base bg-white shadow-sm p-4 flex flex-col gap-3 min-h-[200px] border-dashed border-2 border-gray-100">
                        <p className="text-[13px] font-bold text-gray-400">{title}</p>
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-xs text-gray-300">Aguardando dados...</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card-base bg-white shadow-sm p-4 flex flex-col gap-3 min-h-[200px] border-dashed border-2 border-gray-100">
                <p className="text-[13px] font-bold text-gray-400">{charts[2]}</p>
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-300">Aguardando dados...</span>
                </div>
            </div>
        </>
    );
}