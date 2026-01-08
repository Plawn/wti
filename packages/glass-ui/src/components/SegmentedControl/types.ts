import type { JSX } from 'solid-js';

export interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string | JSX.Element;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Additional CSS classes */
  class?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Accessible label for the group */
  'aria-label'?: string;
}
