import { type Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useDisclosure, useIsDark } from '../../hooks';
import type { DropdownProps } from './types';

export const Dropdown: Component<DropdownProps> = (props) => {
  // Use internal state if not controlled
  const disclosure = useDisclosure(false);
  let triggerRef: HTMLButtonElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const isDark = useIsDark();
  const placement = () => props.placement ?? 'bottom-start';

  // Determine if controlled or uncontrolled
  const isControlled = () => props.open !== undefined;
  const isOpen = () => (isControlled() ? (props.open as boolean) : disclosure.isOpen());

  const setOpen = (value: boolean) => {
    if (isControlled()) {
      props.onOpenChange?.(value);
    } else {
      if (value) {
        disclosure.onOpen();
      } else {
        disclosure.onClose();
      }
      props.onOpenChange?.(value);
    }
  };

  const handleToggle = () => {
    setOpen(!isOpen());
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      handleClose();
      triggerRef?.focus();
    } else if ((e.key === 'Enter' || e.key === ' ') && !isOpen()) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Close on click outside
  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef &&
        !contentRef.contains(target) &&
        triggerRef &&
        !triggerRef.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  // Calculate position styles
  const getPositionStyles = () => {
    if (!triggerRef) {
      return {};
    }
    const rect = triggerRef.getBoundingClientRect();
    const p = placement();

    const styles: Record<string, string> = {};

    // Vertical positioning
    if (p.startsWith('bottom')) {
      styles.top = `${rect.bottom + 4}px`;
    } else if (p.startsWith('top')) {
      styles.bottom = `${window.innerHeight - rect.top + 4}px`;
    }

    // Horizontal positioning
    if (p.includes('start') || p === 'bottom' || p === 'top') {
      styles.left = `${rect.left}px`;
    }
    if (p.includes('end')) {
      styles.right = `${window.innerWidth - rect.right}px`;
    }
    if (p === 'bottom' || p === 'top') {
      // Center alignment for plain bottom/top
      styles.left = `${rect.left + rect.width / 2}px`;
      styles.transform = 'translateX(-50%)';
    }

    return styles;
  };

  return (
    <div class={`relative inline-block ${props.class ?? ''}`}>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen()}
        class="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer"
      >
        {props.trigger}
      </button>
      <Show when={isOpen()}>
        <Portal>
          <div
            ref={contentRef}
            class={`fixed z-50 glass-card rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-150 ${isDark() ? 'dark' : ''} ${props.contentClass ?? ''}`}
            style={getPositionStyles()}
          >
            {props.children}
          </div>
        </Portal>
      </Show>
    </div>
  );
};
