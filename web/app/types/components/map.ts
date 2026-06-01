export type RegionSlug = "norte" | "nordeste" | "centroeste" | "sudeste" | "sul";

export interface RegionGeoConstant {
    id: RegionSlug;
    name: string;
    colorVar: string;
    hoverColorVar: string;
    pathRoute: string;
}

export interface UFGeoConstant {
    sigla: string;
    name: string;
    region: RegionSlug;
    path: string;
}