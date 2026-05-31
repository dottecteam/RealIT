export function InsightCard({ title, desc, type }: { title: string, desc: string, type: 'success' | 'error' }) {
  const statusColor = type === 'success' ? 'var(--success)' : 'var(--error)';

  return (
    <div className="card-base bg-white p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }} /> 
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}