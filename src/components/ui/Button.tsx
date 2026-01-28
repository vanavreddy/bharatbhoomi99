'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-primary text-white',
          'hover:bg-brand-primary-dark',
          'focus-visible:ring-brand-primary',
        ],
        secondary: [
          'bg-brand-secondary text-gray-900',
          'hover:bg-brand-secondary/90',
          'focus-visible:ring-brand-secondary',
        ],
        accent: [
          'bg-brand-accent text-white',
          'hover:bg-brand-accent-dark',
          'focus-visible:ring-brand-accent',
        ],
        outline: [
          'border-2 border-brand-primary text-brand-primary',
          'hover:bg-brand-primary hover:text-white',
          'focus-visible:ring-brand-primary',
        ],
        ghost: [
          'text-brand-primary',
          'hover:bg-brand-primary/10',
          'focus-visible:ring-brand-primary',
        ],
        danger: [
          'bg-semantic-error text-white',
          'hover:bg-semantic-error/90',
          'focus-visible:ring-semantic-error',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
            <span aria-hidden="true">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
