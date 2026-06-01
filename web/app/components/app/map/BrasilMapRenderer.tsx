export const BrasilMapRenderer = ({ paths, hoveredUF, onHover, config, fontSize, viewBox }: any) => (
    <svg viewBox={viewBox} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {paths.map((estado: any) => (
            <g key={estado.uf}>
                <path
                    d={estado.d}
                    fill={hoveredUF === estado.uf ? config.color : config.fill}
                    stroke={config.color}
                    strokeWidth={hoveredUF === estado.uf ? 1.5 : 0.7}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => onHover(estado.uf)}
                    onMouseLeave={() => onHover(null)}
                />
                <text
                    x={estado.centroid[0]} y={estado.centroid[1]}
                    fontSize={fontSize} fontWeight={700}
                    fill={hoveredUF === estado.uf ? "#fff" : config.color}
                    className="pointer-events-none"
                >
                    {estado.uf}
                </text>
            </g>
        ))}
    </svg>
);