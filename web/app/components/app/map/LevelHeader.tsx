export const LevelHeader = ({ title, desc, colorClass }: { title: string, desc: string, colorClass: string }) => (
    <div className="flex items-center gap-4">
        <div className={`h-10 w-2 ${colorClass} rounded-full`} />
        <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{title}</h2>
            <p className="text-sm text-gray-400 font-medium">{desc}</p>
        </div>
    </div>
);