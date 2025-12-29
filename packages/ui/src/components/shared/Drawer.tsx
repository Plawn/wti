import { type Component, type JSX, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

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
}

const sizeStyles: Record<DrawerSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  xl: 'max-w-lg',
};

const positionStyles: Record<DrawerPosition, { container: string; enter: string; exit: string }> = {
  left: {
    container: 'left-0',
    enter: 'animate-in slide-in-from-left',
    exit: 'animate-out slide-out-to-left',
  },
  right: {
    container: 'right-0',
    enter: 'animate-in slide-in-from-right',
    exit: 'animate-out slide-out-to-right',
  },
};

export const Drawer: Component<DrawerProps> = (props) => {
  const position = () => props.position ?? 'right';
  const size = () => props.size ?? 'md';
  const showClose = () => props.showClose ?? true;
  const closeOnBackdrop = () => props.closeOnBackdrop ?? true;
  const closeOnEscape = () => props.closeOnEscape ?? true;

  // Handle escape key
  createEffect(() => {
    if (!props.open || !closeOnEscape()) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  // Prevent body scroll when drawer is open
  createEffect(() => {
    if (props.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    onCleanup(() => {
      document.body.style.overflow = '';
    });
  });

  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdrop() && e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const styles = () => positionStyles[position()];

  // Check if dark mode is active
  const isDark = () =>
    document.documentElement.classList.contains('dark') || document.querySelector('.dark') !== null;

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={`fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 ${isDark() ? 'dark' : ''}`}
          onClick={handleBackdropClick}
          onKeyDown={(e) => e.key === 'Enter' && handleBackdropClick(e as unknown as MouseEvent)}
          aria-modal="true"
          aria-labelledby={props.title ? 'drawer-title' : undefined}
        >
          <div
            class={`fixed top-0 ${styles().container} h-full w-full ${sizeStyles[size()]} glass-thick shadow-2xl ${styles().enter} duration-300`}
          >
            <div class="flex flex-col h-full">
              {/* Header */}
              <Show when={props.title || showClose()}>
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5">
                  <Show when={props.title}>
                    <h2
                      id="drawer-title"
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {props.title}
                    </h2>
                  </Show>
                  <Show when={showClose()}>
                    <button
                      type="button"
                      onClick={props.onClose}
                      class="ml-auto p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      aria-label="Close"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Show>
                </div>
              </Show>

              {/* Content */}
              <div class="flex-1 p-6 overflow-y-auto">{props.children}</div>

              {/* Footer */}
              <Show when={props.footer}>
                <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/5">
                  {props.footer}
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
