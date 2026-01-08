import type { JSX } from 'solid-js';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /** Type of alert, determines color styling */
  type: AlertType;
  /** Optional title displayed prominently */
  title?: string;
  /** Alert content */
  children: JSX.Element;
  /** Custom icon to display (defaults to type-specific icon) */
  icon?: JSX.Element;
  /** Callback when close button is clicked (shows close button when provided) */
  onClose?: () => void;
  /** Additional CSS classes */
  class?: string;
}
