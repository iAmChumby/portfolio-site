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
    const baseClasses = 'card';
    
    const variantClasses = {
      default: '',
      elevated: 'card-elevated',
      flat: 'card-flat',
      outline: 'card-outline',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      {
        'card-interactive': interactive,
        'card-loading': loading,
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
      <div className={cn('card-header', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('card-body', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('card-footer', className)} ref={ref} {...props}>
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