import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'surgical';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#3C7049] text-white hover:bg-[#325d3d] active:bg-[#284a30] focus-visible:outline-[#3C7049] shadow-sm',
    secondary:
      'bg-[#F4F2EE] text-[#22241F] border border-[#E7E4DC] hover:bg-[#EAE7DF] active:bg-[#DFDCD4] focus-visible:outline-[#5A564C]',
    outline:
      'bg-transparent text-[#22241F] border border-[#E7E4DC] hover:bg-[#F4F2EE] active:bg-[#EAE7DF] focus-visible:outline-[#3C7049]',
    surgical:
      'bg-[#3E6B8E] text-white hover:bg-[#325774] active:bg-[#26445c] focus-visible:outline-[#3E6B8E] shadow-sm',
    danger:
      'bg-[#B03A28] text-white hover:bg-[#963020] active:bg-[#7a261a] focus-visible:outline-[#B03A28] shadow-sm',
    ghost:
      'bg-transparent text-[#5A564C] hover:text-[#22241F] hover:bg-[#F4F2EE] active:bg-[#EAE7DF] focus-visible:outline-[#3C7049]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
