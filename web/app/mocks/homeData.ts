import { TrendingUp, Users, Wallet, AlertCircle } from "lucide-react";

export const HOME_KPIS = [
  { label: "Score Médio (RC)", val: "3.42", change: "+12%", icon: TrendingUp, color: "var(--success)" },
  { label: "Maturidade Digital", val: "2.18", change: "+5.4%", icon: Users, color: "var(--tertiary)" },
  { label: "Fragilidade de Renda", val: "1.05", change: "-2.1%", icon: Wallet, color: "var(--primary)" },
  { label: "Alertas de Risco", val: "14", change: "Estável", icon: AlertCircle, color: "var(--error)" }
];

export const RECENT_ACTIVITIES = [
  { title: "Relatório Gerado", desc: "Ranking Nacional de Maio", time: "Há 2h" },
  { title: "Dados Atualizados", desc: "Variáveis do IBGE (PIX)", time: "Há 5h" },
  { title: "Alerta de Score", desc: "Mudança de quadrante em SP", time: "Ontem" }
];
