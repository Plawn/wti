import type { JSX } from 'solid-js';

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuItem {
  /** Display label for the menu item */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Optional icon element */
  icon?: JSX.Element;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** If true, renders a divider instead of a menu item */
  divider?: boolean;
}

export interface MenuProps {
  /** Trigger element that opens the menu */
  trigger: JSX.Element;
  /** Menu items to display */
  items: MenuItem[];
  /** Menu placement relative to trigger */
  placement?: MenuPlacement;
  /** Additional CSS classes for the menu container */
  class?: string;
}
