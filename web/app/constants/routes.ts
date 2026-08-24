import { LayoutDashboard, BarChart3, Users, User, LucideIcon } from "lucide-react";

interface RouteItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const ROUTES = {
  AUTH: {
    LOGIN: { label: "Entrar", href: "/login" },
    REQUEST: { label: "Solicite acesso", href: "/solicite" },
  },

  APP: {
    HOME: { label: "Início", href: "/app", icon: LayoutDashboard },
    GRAFICOS: { label: "Gráficos", href: "/app/graficos", icon: BarChart3 },
    FUNCIONARIOS: { label: "Funcionários", href: "/app/funcionarios", icon: Users },
    PERFIL: { label: "Perfil", href: "/app/perfil", icon: User },
  },

  get appRoutesList(): RouteItem[] {
    return Object.values(this.APP);
  }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login"
  },
  DASHBOARD: {
    CHARTS: "/data/dashboard-charts",
    REGIONAL: "/data/regional-charts",
    ESTADUAL: "/data/estadual-charts",
  },
  USERS: {
    BASE: "/users",
    CREATE: "/users/create",
    ME: "/users/me",
    EDIT: (id: number | string) => `/users/edit/${id}`,
    INACTIVATE: (id: number | string) => `/users/inactivate/${id}`,
    ACTIVATE: (id: number | string) => `/users/activate/${id}`,
  }
};

import { RegionGeoConstant } from "@/app/types/components/map";

export const REGIONS_GEO_DATA: Record<string, RegionGeoConstant> = {
  norte: { id: "norte", name: "Região Norte", colorVar: "var(--primary-light)", hoverColorVar: "var(--primary)", pathRoute: "/app/graficos/regiao/norte" },
  nordeste: { id: "nordeste", name: "Região Nordeste", colorVar: "var(--secondary-light)", hoverColorVar: "var(--secondary)", pathRoute: "/app/graficos/regiao/nordeste" },
  centroeste: { id: "centroeste", name: "Região Centro-Oeste", colorVar: "var(--tertiary-light)", hoverColorVar: "var(--tertiary)", pathRoute: "/app/graficos/regiao/centroeste" },
  sudeste: { id: "sudeste", name: "Região Sudeste", colorVar: "var(--primary)", hoverColorVar: "var(--primary-dark)", pathRoute: "/app/graficos/regiao/sudeste" },
  sul: { id: "sul", name: "Região Sul", colorVar: "var(--success-light)", hoverColorVar: "var(--success)", pathRoute: "/app/graficos/regiao/sul" },
};