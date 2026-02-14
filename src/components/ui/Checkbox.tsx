'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, disabled, ...props }, ref) => {
    const reactId = useId();
    const checkboxId = id || `checkbox-${reactId}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-semantic-error'
                : 'border-gray-300 checked:border-brand-primary checked:bg-brand-primary',
              className
            )}
            {...props}
          />
          <Check
            className="absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium cursor-pointer',
                  disabled ? 'text-gray-400' : 'text-gray-900'
                )}
              >
                {label}
              </label>
            )}
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {error && (
              <p className="text-sm text-semantic-error mt-1" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
