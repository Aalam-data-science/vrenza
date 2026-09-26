import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositive?: boolean;
  };
  status?: 'clinical' | 'surgical' | 'amber' | 'emergency' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  status = 'neutral',
  icon,
}) => {
  const statusColors = {
    clinical: 'border-l-4 border-l-[#3C7049]',
    surgical: 'border-l-4 border-l-[#3E6B8E]',
    amber: 'border-l-4 border-l-[#B8822E]',
    emergency: 'border-l-4 border-l-[#B03A28]',
    neutral: 'border-l border-l-[#E7E4DC]',
  };

  return (
    <div
      className={`bg-[#FBFBF7] border border-[#E7E4DC] rounded-xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(34,36,31,0.03)] ${statusColors[status]}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[#7A7568]">{title}</span>
        {icon && <span className="text-[#5A564C] p-1 rounded bg-[#F4F2EE]">{icon}</span>}
      </div>
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#22241F] font-mono">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-[#7A7568]">{unit}</span>}
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-[#5A564C]">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-mono text-[11px] font-medium ${
                trend.isPositive === true
                  ? 'text-[#3C7049]'
                  : trend.isPositive === false
                  ? 'text-[#B03A28]'
                  : 'text-[#5A564C]'
              }`}
            >
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
