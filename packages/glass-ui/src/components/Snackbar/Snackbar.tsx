import { type Component, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useIsDark } from '../../hooks';
import type { SnackbarPosition, SnackbarProps } from './types';

const positionStyles: Record<SnackbarPosition, string> = {
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

const ANIMATION_DURATION = 200;
const DEFAULT_DURATION = 4000;

export const Snackbar: Component<SnackbarProps> = (props) => {
  const position = () => props.position ?? 'bottom-center';
  const duration = () => props.duration ?? DEFAULT_DURATION;

  // Track visibility separately from open state for exit animation
  const [visible, setVisible] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);

  // Check if dark mode is active (needed for Portal which renders outside the dark class container)
  const isDark = useIsDark();

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

  // Auto-dismiss timer
  createEffect(() => {
    if (props.open && duration() > 0) {
      const timer = setTimeout(() => {
        props.onClose();
      }, duration());
      onCleanup(() => clearTimeout(timer));
    }
  });

  const handleAction = () => {
    props.onAction?.();
    props.onClose();
  };

  const enterAnimation = () => {
    switch (position()) {
      case 'bottom-left':
        return 'animate-in slide-in-from-left-4 fade-in';
      case 'bottom-right':
        return 'animate-in slide-in-from-right-4 fade-in';
      default:
        return 'animate-in slide-in-from-bottom-4 fade-in';
    }
  };

  const exitAnimation = () => {
    switch (position()) {
      case 'bottom-left':
        return 'animate-out slide-out-to-left-4 fade-out';
      case 'bottom-right':
        return 'animate-out slide-out-to-right-4 fade-out';
      default:
        return 'animate-out slide-out-to-bottom-4 fade-out';
    }
  };

  const animationClasses = () =>
    isClosing() ? `${exitAnimation()} duration-200` : `${enterAnimation()} duration-200`;

  return (
    <Show when={visible()}>
      <Portal>
        <output
          class={`fixed ${positionStyles[position()]} z-50 ${isDark() ? 'dark' : ''}`}
          aria-live="polite"
        >
          <div
            class={`glass-card flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[200px] max-w-sm ${animationClasses()}`}
          >
            <p class="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
              {props.message}
            </p>
            <Show when={props.action}>
              <button
                type="button"
                onClick={handleAction}
                class="flex-shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {props.action}
              </button>
            </Show>
            <button
              type="button"
              onClick={props.onClose}
              class="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </output>
      </Portal>
    </Show>
  );
};
