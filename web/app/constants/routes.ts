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
    PERFIL: { label: "Perfil", href: "/perfil", icon: User },
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