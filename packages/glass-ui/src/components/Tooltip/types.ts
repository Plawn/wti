import type { JSX } from 'solid-js';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string | JSX.Element;
  children: JSX.Element;
  position?: TooltipPosition;
  delay?: number;
  class?: string;
}
