export interface ErrorDisplayProps {
  /** The error message to display */
  message: string;
  /** The error title (default: 'Request Failed') */
  title?: string;
  /** Additional CSS classes */
  class?: string;
}
