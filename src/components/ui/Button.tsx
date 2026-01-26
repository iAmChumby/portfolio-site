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
  mobileFullWidth?: boolean;
  mobileCompact?: boolean;
  responsive?: boolean;
  touchOptimized?: boolean;
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
    mobileFullWidth = false,
    mobileCompact = false,
    responsive = true,
    touchOptimized = true,
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
      md: 'btn-md',
      lg: 'btn-lg'
    };

    // Generate responsive classes based on props
    const getResponsiveClasses = () => {
      const classes = [];
      
      if (mobileFullWidth) {
        classes.push('btn-mobile-full');
      }
      
      if (mobileCompact) {
        classes.push('btn-mobile-compact');
      }
      
      if (touchOptimized) {
        classes.push('touch-manipulation');
      }
      
      return classes;
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
            'transform transition-transform duration-200 ease-out': responsive,
            'hover:scale-105 active:scale-95': responsive && !disabled && !loading,
          },
          getResponsiveClasses(),
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        aria-label={iconOnly && typeof children === 'string' ? children : undefined}
        {...props}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            {!iconOnly && (
              <span className="ml-2 opacity-75">
                {typeof children === 'string' ? 'Loading...' : children}
              </span>
            )}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={cn('flex-shrink-0', { 'mr-2': !iconOnly })}>
                {icon}
              </span>
            )}
            {!iconOnly && (
              <span className="flex-1 text-center">
                {children}
              </span>
            )}
            {icon && iconPosition === 'right' && (
              <span className={cn('flex-shrink-0', { 'ml-2': !iconOnly })}>
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };