import type { JSX } from 'solid-js';

export interface TabItem {
  id: string;
  label: string;
  icon?: JSX.Element;
  content: JSX.Element;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  /** Default tab id when uncontrolled */
  defaultTab?: string;
  /** Active tab id for controlled mode */
  activeTab?: string;
  /** Callback when tab changes (for controlled mode) */
  onTabChange?: (tabId: string) => void;
  /** Additional CSS classes */
  class?: string;
}
