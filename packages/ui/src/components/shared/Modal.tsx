import { type Component, type JSX, Show, createEffect, onCleanup, onMount } from 'solid-js';

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
  let dialogRef: HTMLDialogElement | undefined;

  const size = () => props.size ?? 'md';
  const showClose = () => props.showClose ?? true;
  const closeOnBackdrop = () => props.closeOnBackdrop ?? true;
  const closeOnEscape = () => props.closeOnEscape ?? true;

  // Sync dialog open state with props.open
  createEffect(() => {
    if (!dialogRef) {
      return;
    }

    if (props.open) {
      if (!dialogRef.open) {
        dialogRef.showModal();
      }
    } else {
      if (dialogRef.open) {
        dialogRef.close();
      }
    }
  });

  // Handle native dialog close event (e.g., Escape key)
  // Using onMount since this only needs to run once and has no reactive dependencies
  onMount(() => {
    if (!dialogRef) {
      return;
    }

    const handleClose = () => {
      if (props.open) {
        props.onClose();
      }
    };

    const handleCancel = (e: Event) => {
      if (!closeOnEscape()) {
        e.preventDefault();
      }
    };

    dialogRef.addEventListener('close', handleClose);
    dialogRef.addEventListener('cancel', handleCancel);

    onCleanup(() => {
      dialogRef?.removeEventListener('close', handleClose);
      dialogRef?.removeEventListener('cancel', handleCancel);
    });
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
    if (closeOnBackdrop() && e.target === dialogRef) {
      props.onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm m-auto"
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === dialogRef && props.onClose()}
      aria-labelledby={props.title ? 'modal-title' : undefined}
    >
      <div
        class={`w-full ${sizeStyles[size()]} glass-card rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200`}
      >
        {/* Header */}
        <Show when={props.title || showClose()}>
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5">
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Show>
          </div>
        </Show>

        {/* Content */}
        <div class="p-6 max-h-[70vh] overflow-y-auto">{props.children}</div>

        {/* Footer */}
        <Show when={props.footer}>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/5">
            {props.footer}
          </div>
        </Show>
      </div>
    </dialog>
  );
};
