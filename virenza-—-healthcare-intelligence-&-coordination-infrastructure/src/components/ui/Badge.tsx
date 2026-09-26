import React from 'react';
import { ShieldCheck, Cpu, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export type BadgeVariant =
  | 'clinical'
  | 'ai'
  | 'emergency'
  | 'routine'
  | 'amber'
  | 'neutral'
  | 'outline';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon = true,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 tracking-tight',
    sm: 'text-xs px-2 py-0.5 tracking-tight',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    clinical: 'bg-[#D9EBDE] text-[#224A2C] border border-[#3C7049]/20',
    ai: 'bg-[#DDE8F0] text-[#1E435E] border border-[#3E6B8E]/20',
    emergency: 'bg-[#FBE9E7] text-[#852516] border border-[#B03A28]/20 font-semibold',
    routine: 'bg-[#D9EBDE] text-[#3C7049] border border-[#3C7049]/15',
    amber: 'bg-[#FBF3DE] text-[#7A5317] border border-[#B8822E]/20',
    neutral: 'bg-[#F4F2EE] text-[#5A564C] border border-[#E7E4DC]',
    outline: 'bg-transparent text-[#22241F] border border-[#E7E4DC]',
  };

  const getIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'clinical':
        return <CheckCircle className="w-3 h-3 shrink-0 text-[#3C7049]" />;
      case 'ai':
        return <Cpu className="w-3 h-3 shrink-0 text-[#3E6B8E]" />;
      case 'emergency':
        return <AlertTriangle className="w-3 h-3 shrink-0 text-[#B03A28]" />;
      case 'amber':
        return <Info className="w-3 h-3 shrink-0 text-[#B8822E]" />;
      case 'routine':
        return <ShieldCheck className="w-3 h-3 shrink-0 text-[#3C7049]" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono select-none uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {getIcon()}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};
