
import { CheckCircle2, AlertTriangle, XCircle, LucideIcon } from "lucide-react";

export type InsightType = "success" | "warning" | "error";

export const mapInsightStyles: Record<
  InsightType,
  {
    icon: LucideIcon;
    indicatorBg: string;
    borderHover: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    indicatorBg: "bg-[var(--success)]",
    borderHover: "hover:border-[var(--success)]/20",
  },
  warning: {
    icon: AlertTriangle,
    indicatorBg: "bg-[var(--warning)]",
    borderHover: "hover:border-[var(--warning)]/20",
  },
  error: {
    icon: XCircle,
    indicatorBg: "bg-[var(--error)]",
    borderHover: "hover:border-[var(--error)]/20",
  },
};