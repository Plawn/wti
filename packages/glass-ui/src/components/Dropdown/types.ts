import type { JSX } from 'solid-js';

export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'top';

export interface DropdownProps {
  /** Trigger element that opens the dropdown */
  trigger: JSX.Element;
  /** Content to display in the dropdown */
  children: JSX.Element;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dropdown placement relative to trigger */
  placement?: DropdownPlacement;
  /** Additional CSS classes for the dropdown container */
  class?: string;
  /** Additional CSS classes for the content container */
  contentClass?: string;
}
