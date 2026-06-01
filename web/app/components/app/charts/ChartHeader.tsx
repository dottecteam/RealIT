export const ChartHeader = ({ meta }: { meta: any }) => (
    <div className="px-4 pt-3 flex flex-col gap-0.5">
        <span
            className="inline-block self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${meta.cores[0]}33`, color: meta.textColors }}
        >
            {meta.label}
        </span>
        <p className="text-[10px] text-gray-400">{meta.descricao}</p>
    </div>
);