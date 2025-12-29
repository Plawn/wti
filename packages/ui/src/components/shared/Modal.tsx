import { type Component, type JSX, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  size?: ModalSize;
  /** Show close button in header */
  showClose?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  footer?: JSX.Element;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal: Component<ModalProps> = (props) => {
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

  // Prevent body scroll when modal is open
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

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleBackdropClick}
          onKeyDown={(e) => e.key === 'Enter' && handleBackdropClick(e as unknown as MouseEvent)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={props.title ? 'modal-title' : undefined}
        >
          <div
            class={`w-full ${sizeStyles[size()]} glass-card rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200`}
          >
            {/* Header */}
            <Show when={props.title || showClose()}>
              <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-white/5">
                <Show when={props.title}>
                  <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
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
            <div class="p-6 max-h-[70vh] overflow-y-auto">{props.children}</div>

            {/* Footer */}
            <Show when={props.footer}>
              <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 dark:border-white/5">
                {props.footer}
              </div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
