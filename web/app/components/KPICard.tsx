import { KPICardProps } from "../types/components/KPICards";

export function KPICard({ label, val, change, icon: Icon, color }: KPICardProps) {
  return (
    <div className="card-base bg-white p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</span>
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary/5 transition-colors">
          <Icon size={20} style={{ color: color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tighter">{val}</p>
      <p className="text-xs mt-2 font-bold" style={{ color: color }}>
        {change}
      </p>
    </div>
  );
}