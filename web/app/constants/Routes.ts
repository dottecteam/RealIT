export const AUTH_ROUTES = {
    login: { label: "Entrar", route: "/login" },
    signup: { label: "Começar agora", route: "/cadastro" }
};

import { LayoutDashboard, BarChart3, Users, User } from "lucide-react";

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
    label: "Funcionários",
    href: "/app/funcionarios",
    icon: Users,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: User,
  },
];