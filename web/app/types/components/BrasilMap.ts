export interface EstadoPath {
  uf: string;
  nome: string;
  codIbge: number;
  regiao: string;
  centroid: [number, number];
  d: string;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  lines: string[];
}

export interface EstadoProps {
  estado: EstadoPath;
  fill: string;
  isHovered: boolean;
  anyHovered: boolean;
  onMouseEnter: (e: React.MouseEvent, estado: EstadoPath) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  lines: string[];
}