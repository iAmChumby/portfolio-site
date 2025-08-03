'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'outline-secondary'
    | 'ghost'
    | 'link'
    | 'danger'
    | 'success';
  size?: 'sm' | 'base' | 'lg' | 'xl';
  loading?: boolean;
  icon?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'base',
      loading = false,
      icon = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      'outline-secondary': 'btn-outline-secondary',
      ghost: 'btn-ghost',
      link: 'btn-link',
      danger: 'btn-danger',
      success: 'btn-success',
    };

    const sizeClasses = {
      sm: 'btn-sm',
      base: '',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      {
        'btn-loading': loading,
        'btn-icon': icon,
        'w-full': fullWidth,
      },
      className
    );

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;