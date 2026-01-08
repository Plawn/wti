import type { JSX } from 'solid-js';

export interface SectionProps {
  /** The section title */
  title: string;
  /** The section content */
  children: JSX.Element;
  /** Additional CSS classes */
  class?: string;
}
