import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import type { ChipColor, ChipProps, ChipSize } from './types';

const sizeStyles: Record<ChipSize, { container: string; icon: string }> = {
  sm: { container: 'px-2 py-0.5 text-xs gap-1', icon: 'w-3 h-3' },
  md: { container: 'px-2.5 py-1 text-sm gap-1.5', icon: 'w-3.5 h-3.5' },
  lg: { container: 'px-3 py-1.5 text-base gap-2', icon: 'w-4 h-4' },
};

const filledColors: Record<ChipColor, string> = {
  default: 'glass-button',
  primary:
    'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-700/50',
  success:
    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50',
  warning:
    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50',
  error:
    'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-700/50',
};

const outlinedColors: Record<ChipColor, string> = {
  default:
    'bg-transparent border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300',
  primary:
    'bg-transparent border border-violet-300 dark:border-violet-600 text-violet-600 dark:text-violet-400',
  success:
    'bg-transparent border border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400',
  warning:
    'bg-transparent border border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400',
  error:
    'bg-transparent border border-rose-300 dark:border-rose-600 text-rose-600 dark:text-rose-400',
};

const RemoveIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Chip: Component<ChipProps> = (props) => {
  const variant = () => props.variant ?? 'filled';
  const color = () => props.color ?? 'default';
  const size = () => props.size ?? 'md';
  const styles = () => sizeStyles[size()];

  const getColorStyle = () => {
    const colorMap = variant() === 'filled' ? filledColors : outlinedColors;
    return colorMap[color()];
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    props.onRemove?.();
  };

  return (
    <span
      class={`inline-flex items-center rounded-full font-medium transition-all ${styles().container} ${getColorStyle()} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${props.class ?? ''}`}
    >
      {props.children}
      <Show when={props.onRemove && !props.disabled}>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors -mr-0.5"
          onClick={handleRemove}
          aria-label="Remove"
        >
          <RemoveIcon class={styles().icon} />
        </button>
      </Show>
    </span>
  );
};
