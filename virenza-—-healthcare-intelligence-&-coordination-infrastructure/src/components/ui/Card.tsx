import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'alt' | 'elevated' | 'emergency';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-[#FBFBF7] border border-[#E7E4DC] shadow-[0_1px_3px_rgba(34,36,31,0.04)]',
    alt: 'bg-[#F4F2EE] border border-[#E7E4DC]',
    elevated:
      'bg-[#FBFBF7] border border-[#E7E4DC] shadow-[0_4px_16px_rgba(34,36,31,0.06),0_1px_3px_rgba(34,36,31,0.03)]',
    emergency: 'bg-[#FBE9E7] border-2 border-[#B03A28] shadow-[0_4px_16px_rgba(176,58,40,0.1)]',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-xl transition-colors duration-150 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
