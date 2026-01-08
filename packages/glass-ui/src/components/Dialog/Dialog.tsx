import { type Component, Show, createEffect, onCleanup, onMount } from 'solid-js';
import type { DialogProps, DialogVariant } from './types';

const confirmButtonStyles: Record<DialogVariant, string> = {
  default: 'btn-primary',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors focus:outline-none focus-ring',
};

export const Dialog: Component<DialogProps> = (props) => {
  let dialogRef: HTMLDialogElement | undefined;

  const variant = () => props.variant ?? 'default';
  const confirmLabel = () => props.confirmLabel ?? 'Confirm';
  const cancelLabel = () => props.cancelLabel ?? 'Cancel';

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
  onMount(() => {
    if (!dialogRef) {
      return;
    }

    const handleClose = () => {
      if (props.open) {
        props.onOpenChange(false);
        props.onCancel?.();
      }
    };

    dialogRef.addEventListener('close', handleClose);

    onCleanup(() => {
      dialogRef?.removeEventListener('close', handleClose);
    });
  });

  // Prevent body scroll when dialog is open
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
    if (e.target === dialogRef) {
      props.onOpenChange(false);
      props.onCancel?.();
    }
  };

  const handleCancel = () => {
    props.onOpenChange(false);
    props.onCancel?.();
  };

  const handleConfirm = () => {
    props.onConfirm();
    props.onOpenChange(false);
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native dialog handles Escape key
    <dialog
      ref={dialogRef}
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm m-auto"
      onClick={handleBackdropClick}
      aria-labelledby="dialog-title"
      aria-describedby={props.description ? 'dialog-description' : undefined}
    >
      <div class="w-full max-w-sm glass-card rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Content */}
        <div class="p-6">
          <h2 id="dialog-title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {props.title}
          </h2>
          <Show when={props.description}>
            <p id="dialog-description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {props.description}
            </p>
          </Show>
        </div>

        {/* Actions */}
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/5">
          <button type="button" onClick={handleCancel} class="btn-secondary px-4 py-2 text-sm">
            {cancelLabel()}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            class={`${confirmButtonStyles[variant()]} px-4 py-2 text-sm`}
          >
            {confirmLabel()}
          </button>
        </div>
      </div>
    </dialog>
  );
};
