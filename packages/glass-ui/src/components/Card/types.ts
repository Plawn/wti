import type { JSX } from 'solid-js';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps {
  /** Card header content */
  header?: JSX.Element;
  /** Card body content */
  children: JSX.Element;
  /** Card footer content */
  footer?: JSX.Element;
  /** Visual variant */
  variant?: CardVariant;
  /** Additional CSS classes */
  class?: string;
}
