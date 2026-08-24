import { REGIOES_CONFIG, Regiao } from "@/app/constants/map/brasilMapPaths";

export const RegionFilterButtons = ({ active, onSelect }: { active: string, onSelect: (key: Regiao) => void }) => (
    <div className="flex flex-wrap gap-2">
        {(Object.keys(REGIOES_CONFIG) as Regiao[]).map((key) => {
            const r = REGIOES_CONFIG[key];
            const isActive = active === key;
            return (
                <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className="transition-all duration-150 rounded-full px-4 py-1.5 text-xs font-semibold border"
                    style={{
                        background: isActive ? r.color : "#fff",
                        color: isActive ? "#fff" : "#64748b",
                        borderColor: isActive ? r.color : "#e2e8f0",
                    }}
                >
                    {r.label}
                </button>
            );
        })}
    </div>
);