export const NAV_ROUTES = [
    { label: "Funcionalidades", route: "/funcionalidades" },
    { label: "Sobre", route: "/sobre" },
    { label: "Contato", route: "/contato" }
];

export const AUTH_ROUTES = {
    login: { label: "Entrar", route: "/login" },
    signup: { label: "Começar agora", route: "/cadastro" }
};

import { LayoutDashboard, BarChart3, FileText, Settings } from "lucide-react";

export const APP_ROUTES = [
  {
    label: "Início",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    label: "Gráficos",
    href: "/app/graficos",
    icon: BarChart3,
  },
  {
    label: "Relatórios",
    href: "/app/relatorios",
    icon: FileText,
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];