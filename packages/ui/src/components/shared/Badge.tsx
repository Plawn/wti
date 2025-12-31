import type { Component, JSX } from 'solid-js';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'method';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: JSX.Element;
  variant?: BadgeVariant;
  size?: BadgeSize;
  class?: string;
  /** HTTP method for method variant */
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  error: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  method: '', // Handled separately based on method prop
};

const methodStyles: Record<string, string> = {
  get: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  post: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  put: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  patch: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  delete: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  head: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  options: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[0.625rem]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export const Badge: Component<BadgeProps> = (props) => {
  const variant = () => props.variant ?? 'default';
  const size = () => props.size ?? 'md';

  const getVariantStyle = () => {
    if (variant() === 'method' && props.method) {
      return methodStyles[props.method] ?? methodStyles.options;
    }
    return variantStyles[variant()];
  };

  return (
    <span
      class={`inline-flex items-center font-semibold rounded-md ${sizeStyles[size()]} ${getVariantStyle()} ${props.class ?? ''}`}
    >
      {props.children}
    </span>
  );
};
