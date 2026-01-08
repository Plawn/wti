import { type Component, Show } from 'solid-js';
import type { AlertProps, AlertType } from './types';

const typeStyles: Record<AlertType, { border: string; bg: string; icon: string; iconBg: string }> =
  {
    info: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50/50 dark:bg-blue-900/10',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    success: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    warning: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50/50 dark:bg-amber-900/10',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    error: {
      border: 'border-l-rose-500',
      bg: 'bg-rose-50/50 dark:bg-rose-900/10',
      icon: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    },
  };

const InfoIcon: Component = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SuccessIcon: Component = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>
);

const WarningIcon: Component = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const ErrorIcon: Component = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DefaultIcon: Component<{ type: AlertType }> = (props) => (
  <Show
    when={props.type === 'info'}
    fallback={
      <Show
        when={props.type === 'success'}
        fallback={
          <Show when={props.type === 'warning'} fallback={<ErrorIcon />}>
            <WarningIcon />
          </Show>
        }
      >
        <SuccessIcon />
      </Show>
    }
  >
    <InfoIcon />
  </Show>
);

export const Alert: Component<AlertProps> = (props) => {
  const styles = () => typeStyles[props.type];

  return (
    <div
      class={`glass-card border-l-4 ${styles().border} ${styles().bg} p-4 rounded-xl ${props.class ?? ''}`}
      role="alert"
    >
      <div class="flex items-start gap-3">
        {/* Icon */}
        <div
          class={`flex-shrink-0 w-8 h-8 rounded-lg ${styles().iconBg} ${styles().icon} flex items-center justify-center`}
        >
          <Show when={props.icon} fallback={<DefaultIcon type={props.type} />}>
            {props.icon}
          </Show>
        </div>

        {/* Content */}
        <div class="flex-1 min-w-0">
          <Show when={props.title}>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{props.title}</h3>
          </Show>
          <div class="text-sm text-gray-700 dark:text-gray-300">{props.children}</div>
        </div>

        {/* Close button */}
        <Show when={props.onClose}>
          <button
            type="button"
            onClick={props.onClose}
            class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
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
        </Show>
      </div>
    </div>
  );
};
