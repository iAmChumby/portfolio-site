'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'outline';
  interactive?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'rounded-lg bg-white';
    
    const variantClasses = {
      default: 'shadow-sm border border-border',
      elevated: 'shadow-lg border border-border',
      flat: 'shadow-none border-0',
      outline: 'border-2 border-accent',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      {
        'hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer': interactive,
        'animate-pulse': loading,
      },
      className
    );

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('px-6 py-4 border-b border-border', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('px-6 py-4', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('px-6 py-4 border-t border-border bg-muted/20 rounded-b-lg', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };