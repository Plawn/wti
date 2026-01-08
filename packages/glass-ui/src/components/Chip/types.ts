import type { JSX } from 'solid-js';

export type ChipVariant = 'filled' | 'outlined';
export type ChipSize = 'sm' | 'md' | 'lg';
export type ChipColor = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface ChipProps {
  /** Chip content */
  children: JSX.Element;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
  /** Visual variant */
  variant?: ChipVariant;
  /** Color theme */
  color?: ChipColor;
  /** Chip size */
  size?: ChipSize;
  /** Additional CSS classes */
  class?: string;
  /** Whether the chip is disabled */
  disabled?: boolean;
}
