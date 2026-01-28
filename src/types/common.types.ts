/**
 * Common utility types
 */

import type { ReactNode } from 'react';

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface TestableProps {
  'data-testid'?: string;
}

export interface FieldState {
  value: string;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  isExternal?: boolean;
}
