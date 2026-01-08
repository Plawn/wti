import { type Component, For, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useIsDark } from '../../hooks';
import type { MenuItem, MenuProps } from './types';

export const Menu: Component<MenuProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [focusedIndex, setFocusedIndex] = createSignal(-1);
  let triggerRef: HTMLButtonElement | undefined;
  let menuRef: HTMLDivElement | undefined;

  const placement = () => props.placement ?? 'bottom-start';
  const isDark = useIsDark();

  // Get focusable items (non-divider, non-disabled)
  const focusableItems = () =>
    props.items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.divider && !item.disabled);

  const handleOpen = () => {
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    if (isOpen()) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled || item.divider) {
      return;
    }
    item.onClick?.();
    handleClose();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen()) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    const items = focusableItems();

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        handleClose();
        triggerRef?.focus();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        if (items.length === 0) {
          return;
        }
        const nextIndex =
          focusedIndex() === -1 ? 0 : Math.min(focusedIndex() + 1, items.length - 1);
        setFocusedIndex(nextIndex);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (items.length === 0) {
          return;
        }
        const prevIndex =
          focusedIndex() === -1 ? items.length - 1 : Math.max(focusedIndex() - 1, 0);
        setFocusedIndex(prevIndex);
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex() >= 0 && focusedIndex() < items.length) {
          handleItemClick(items[focusedIndex()].item);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (items.length > 0) {
          setFocusedIndex(0);
        }
        break;
      case 'End':
        e.preventDefault();
        if (items.length > 0) {
          setFocusedIndex(items.length - 1);
        }
        break;
    }
  };

  // Close on click outside
  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef && !menuRef.contains(target) && triggerRef && !triggerRef.contains(target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  // Get actual index in items array from focusable index
  const getActualIndex = (focusableIdx: number) => {
    const items = focusableItems();
    if (focusableIdx < 0 || focusableIdx >= items.length) {
      return -1;
    }
    return items[focusableIdx].index;
  };

  return (
    <div class={`relative inline-block ${props.class ?? ''}`}>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen()}
        class="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer"
      >
        {props.trigger}
      </button>
      <Show when={isOpen()}>
        <Portal>
          <div
            ref={menuRef}
            class={`fixed z-50 min-w-[180px] py-1.5 glass-card rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-150 ${isDark() ? 'dark' : ''}`}
            style={{
              top: `${(triggerRef?.getBoundingClientRect().bottom ?? 0) + 4}px`,
              left: placement().includes('start')
                ? `${triggerRef?.getBoundingClientRect().left ?? 0}px`
                : undefined,
              right: placement().includes('end')
                ? `${window.innerWidth - (triggerRef?.getBoundingClientRect().right ?? 0)}px`
                : undefined,
            }}
            role="menu"
            aria-orientation="vertical"
          >
            <For each={props.items}>
              {(item, index) => (
                <Show
                  when={!item.divider}
                  fallback={<hr class="my-1.5 border-t border-gray-200 dark:border-white/10" />}
                >
                  <button
                    type="button"
                    class={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors
                      ${
                        item.disabled
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                      }
                      ${
                        getActualIndex(focusedIndex()) === index()
                          ? 'bg-black/5 dark:bg-white/5'
                          : ''
                      }`}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                    tabindex={-1}
                  >
                    <Show when={item.icon}>
                      <span class="w-4 h-4 flex items-center justify-center opacity-70">
                        {item.icon}
                      </span>
                    </Show>
                    <span>{item.label}</span>
                  </button>
                </Show>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </div>
  );
};
