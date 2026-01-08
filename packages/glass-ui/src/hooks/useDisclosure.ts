import { type Accessor, createSignal } from 'solid-js';

export interface UseDisclosureReturn {
  /** Whether the disclosure is currently open */
  isOpen: Accessor<boolean>;
  /** Open the disclosure */
  onOpen: () => void;
  /** Close the disclosure */
  onClose: () => void;
  /** Toggle the disclosure state */
  onToggle: () => void;
}

/**
 * Hook for managing open/close state of disclosures like modals, drawers, menus, etc.
 *
 * @param initialState - Initial open state (default: false)
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = createSignal(initialState);

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen((prev) => !prev),
  };
}
