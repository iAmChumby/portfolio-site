import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    iconPosition = 'left',
    iconOnly = false,
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      cta: 'btn-cta'
    };

    const sizes = {
      sm: 'btn-sm',
      md: 'px-6 py-3 text-base min-w-[120px]',
      lg: 'btn-lg'
    };

    return (
      <button
        className={cn(
          'btn',
          variants[variant],
          sizes[size],
          {
            'opacity-50 cursor-not-allowed': disabled || loading,
            'flex items-center gap-2': icon && !iconOnly,
            'btn-icon': icon && !iconOnly,
            'btn-icon-only': iconOnly,
            'w-full': fullWidth,
          },
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {!iconOnly && children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };