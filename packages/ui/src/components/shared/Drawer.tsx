import { type Component, type JSX, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { useI18n } from '../../i18n';
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
  /** Remove padding from content area */
  noPadding?: boolean;
}

const sizeStyles: Record<DrawerSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  xl: 'max-w-lg',
};

const positionStyles: Record<DrawerPosition, { panel: string; enter: string; exit: string }> = {
  left: {
    panel: 'left-0',
    enter: 'animate-in slide-in-from-left',
    exit: 'animate-out slide-out-to-left',
  },
  right: {
    panel: 'right-0',
    enter: 'animate-in slide-in-from-right',
    exit: 'animate-out slide-out-to-right',
  },
};

const ANIMATION_DURATION = 200;

export const Drawer: Component<DrawerProps> = (props) => {
  const { t } = useI18n();
  const position = () => props.position ?? 'right';
  const size = () => props.size ?? 'md';
  const showClose = () => props.showClose ?? true;
  const closeOnBackdrop = () => props.closeOnBackdrop ?? true;
  const closeOnEscape = () => props.closeOnEscape ?? true;

  // Track visibility separately from open state for exit animation
  const [visible, setVisible] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);

  // Handle open/close transitions
  createEffect(() => {
    if (props.open) {
      setIsClosing(false);
      setVisible(true);
    } else if (visible()) {
      // Start closing animation
      setIsClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setIsClosing(false);
      }, ANIMATION_DURATION);
      onCleanup(() => clearTimeout(timer));
    }
  });

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
    if (visible()) {
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

  const backdropClasses = () =>
    isClosing() ? 'animate-out fade-out duration-200' : 'animate-in fade-in duration-200';

  const drawerClasses = () =>
    isClosing() ? `${styles().exit} duration-200` : `${styles().enter} duration-300`;

  return (
    <Show when={visible()}>
      <Portal>
        <div
          class={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${backdropClasses()} ${isDark() ? 'dark' : ''}`}
          onClick={handleBackdropClick}
          onKeyDown={(e) => e.key === 'Enter' && handleBackdropClick(e as unknown as MouseEvent)}
          aria-modal="true"
          aria-labelledby={props.title ? 'drawer-title' : undefined}
        >
          <div
            class={`absolute inset-y-0 ${styles().panel} w-full ${sizeStyles[size()]} glass-thick shadow-2xl overflow-hidden ${drawerClasses()}`}
          >
            <div class="flex flex-col h-full overflow-hidden">
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
              <div class={`flex-1 overflow-y-auto overflow-x-hidden ${props.noPadding ? '' : 'p-6'}`}>{props.children}</div>

              {/* Footer */}
              <Show when={props.footer}>
                <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/5">
                  {props.footer}
                </div>
              </Show>

              {/* Mobile close button - in thumb zone */}
              <div class="md:hidden px-4 py-2 border-t border-gray-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={props.onClose}
                  class="w-full py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-white/10 active:bg-gray-200 dark:active:bg-white/20 transition-colors touch-manipulation"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
