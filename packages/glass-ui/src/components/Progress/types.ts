export type ProgressVariant = 'linear' | 'circular';
export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressColor = 'primary' | 'success' | 'warning' | 'error';

export interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Progress indicator variant */
  variant?: ProgressVariant;
  /** Size of the progress indicator */
  size?: ProgressSize;
  /** Color theme */
  color?: ProgressColor;
  /** Whether to show the percentage value */
  showValue?: boolean;
  /** Additional CSS classes */
  class?: string;
}
