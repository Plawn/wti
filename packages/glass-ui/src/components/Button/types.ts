import type { JSX } from 'solid-js';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button content */
  children: JSX.Element;
  /** Click handler */
  onClick?: () => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Additional CSS classes */
  class?: string;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Icon to display on the left side */
  leftIcon?: JSX.Element;
  /** Icon to display on the right side */
  rightIcon?: JSX.Element;
  /** Whether the button should take full width of its container */
  fullWidth?: boolean;
}

export interface SpinnerProps {
  /** Spinner size */
  size?: ButtonSize;
  /** Additional CSS classes */
  class?: string;
}
