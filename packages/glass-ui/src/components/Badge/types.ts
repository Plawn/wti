import type { JSX } from 'solid-js';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'method';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

export interface BadgeProps {
  /** Badge content */
  children: JSX.Element;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Additional CSS classes */
  class?: string;
  /** HTTP method for method variant - determines color scheme */
  method?: HttpMethod;
}
