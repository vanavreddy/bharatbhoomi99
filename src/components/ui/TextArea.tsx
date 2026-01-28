'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      fullWidth = true,
      id,
      disabled,
      required,
      maxLength,
      showCount = false,
      value,
      ...props
    },
    ref
  ) => {
    const textAreaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = error ? `${textAreaId}-error` : undefined;
    const hintId = hint ? `${textAreaId}-hint` : undefined;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textAreaId}
            className={cn(
              'text-sm font-medium text-gray-700',
              required && "after:content-['*'] after:ml-0.5 after:text-semantic-error"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 resize-y min-h-[100px]',
            'placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error
              ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20'
              : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p id={errorId} className="text-sm text-semantic-error" role="alert">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={hintId} className="text-sm text-gray-500">
                {hint}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <span
              className={cn(
                'text-sm',
                currentLength > maxLength * 0.9 ? 'text-semantic-warning' : 'text-gray-500'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea };
