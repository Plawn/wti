import type { JSX } from 'solid-js';

export interface AccordionItem {
  id: string;
  title: string | JSX.Element;
  content: JSX.Element;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items to be open at once */
  multiple?: boolean;
  /** Additional CSS classes */
  class?: string;
}

export interface AccordionPanelProps {
  title: string | JSX.Element;
  children: JSX.Element;
  defaultOpen?: boolean;
  /** Additional CSS classes */
  class?: string;
}
