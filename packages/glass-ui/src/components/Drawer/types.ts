import type { JSX } from 'solid-js';

export type DrawerPosition = 'left' | 'right';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  position?: DrawerPosition;
  size?: DrawerSize;
  /** Show close button in header */
  showClose?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  footer?: JSX.Element;
  /** Remove padding from content area */
  noPadding?: boolean;
}
