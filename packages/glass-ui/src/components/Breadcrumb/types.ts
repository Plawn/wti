import type { JSX } from 'solid-js';

export interface BreadcrumbItem {
  /** Display label for the breadcrumb item */
  label: string;
  /** Optional href for link-based navigation */
  href?: string;
  /** Optional click handler for programmatic navigation */
  onClick?: () => void;
  /** Optional icon element */
  icon?: JSX.Element;
}

export interface BreadcrumbProps {
  /** Breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Custom separator element (default: /) */
  separator?: JSX.Element;
  /** Additional CSS classes */
  class?: string;
}
