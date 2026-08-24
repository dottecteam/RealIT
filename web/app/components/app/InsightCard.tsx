"use client";

import { InsightType, mapInsightStyles } from "../../constants/components/insightCardStyle";

interface InsightCardProps {
  title: string;
  desc: string;
  type: InsightType;
}

export function InsightCard({ title, desc, type }: InsightCardProps) {
  const styles = mapInsightStyles[type];
  const IconComponent = styles.icon;

  return (
    <div
      className={`
        bg-white p-6 border border-gray-100 rounded-3xl shadow-sm
        transition-all duration-300 transform group
        ${styles.borderHover} hover:shadow-md
      `}
    >
      <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${styles.indicatorBg}`} />
          <span className="tracking-tight leading-tight group-hover:text-primary transition-colors">
            {title}
          </span>
        </div>

        <IconComponent
          size={16}
          className="text-gray-300 group-hover:scale-110 transition-transform duration-300"
        />
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}