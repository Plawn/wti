import type { Component } from 'solid-js';
import { Show, createMemo } from 'solid-js';
import type { ProgressColor, ProgressProps, ProgressSize } from './types';

const linearSizes: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const circularSizes: Record<ProgressSize, { size: number; stroke: number }> = {
  sm: { size: 24, stroke: 3 },
  md: { size: 40, stroke: 4 },
  lg: { size: 56, stroke: 5 },
};

const colorStyles: Record<ProgressColor, { track: string; fill: string }> = {
  primary: {
    track: 'bg-surface-200/60 dark:bg-surface-700/40',
    fill: 'bg-violet-500 dark:bg-violet-400',
  },
  success: {
    track: 'bg-emerald-100 dark:bg-emerald-900/30',
    fill: 'bg-emerald-500 dark:bg-emerald-400',
  },
  warning: {
    track: 'bg-amber-100 dark:bg-amber-900/30',
    fill: 'bg-amber-500 dark:bg-amber-400',
  },
  error: {
    track: 'bg-rose-100 dark:bg-rose-900/30',
    fill: 'bg-rose-500 dark:bg-rose-400',
  },
};

const circularColorStyles: Record<ProgressColor, { track: string; fill: string }> = {
  primary: {
    track: 'stroke-surface-200 dark:stroke-surface-700',
    fill: 'stroke-violet-500 dark:stroke-violet-400',
  },
  success: {
    track: 'stroke-emerald-200 dark:stroke-emerald-900',
    fill: 'stroke-emerald-500 dark:stroke-emerald-400',
  },
  warning: {
    track: 'stroke-amber-200 dark:stroke-amber-900',
    fill: 'stroke-amber-500 dark:stroke-amber-400',
  },
  error: {
    track: 'stroke-rose-200 dark:stroke-rose-900',
    fill: 'stroke-rose-500 dark:stroke-rose-400',
  },
};

const LinearProgress: Component<ProgressProps> = (props) => {
  const size = () => props.size ?? 'md';
  const color = () => props.color ?? 'primary';
  const styles = () => colorStyles[color()];
  const clampedValue = () => Math.min(100, Math.max(0, props.value));

  return (
    <div class={`w-full ${props.class ?? ''}`}>
      <Show when={props.showValue}>
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-medium text-surface-600 dark:text-surface-400">
            {Math.round(clampedValue())}%
          </span>
        </div>
      </Show>
      {/* biome-ignore lint/a11y/useFocusableInteractive: Progress bars are visual indicators, not interactive */}
      <div
        class={`w-full rounded-full overflow-hidden ${linearSizes[size()]} ${styles().track}`}
        role="progressbar"
        aria-valuenow={clampedValue()}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          class={`h-full rounded-full transition-all duration-300 ease-out ${styles().fill}`}
          style={{ width: `${clampedValue()}%` }}
        />
      </div>
    </div>
  );
};

const CircularProgress: Component<ProgressProps> = (props) => {
  const size = () => props.size ?? 'md';
  const color = () => props.color ?? 'primary';
  const dimensions = () => circularSizes[size()];
  const styles = () => circularColorStyles[color()];
  const clampedValue = () => Math.min(100, Math.max(0, props.value));

  const circumference = createMemo(() => {
    const radius = (dimensions().size - dimensions().stroke) / 2;
    return 2 * Math.PI * radius;
  });

  const strokeDashoffset = createMemo(() => {
    return circumference() - (clampedValue() / 100) * circumference();
  });

  const radius = createMemo(() => (dimensions().size - dimensions().stroke) / 2);
  const center = createMemo(() => dimensions().size / 2);

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: Progress bars are visual indicators, not interactive
    <div
      class={`relative inline-flex items-center justify-center ${props.class ?? ''}`}
      role="progressbar"
      aria-valuenow={clampedValue()}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${Math.round(clampedValue())}%`}
    >
      <svg
        width={dimensions().size}
        height={dimensions().size}
        class="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          class={styles().track}
          cx={center()}
          cy={center()}
          r={radius()}
          fill="none"
          stroke-width={dimensions().stroke}
        />
        {/* Fill */}
        <circle
          class={`${styles().fill} transition-all duration-300 ease-out`}
          cx={center()}
          cy={center()}
          r={radius()}
          fill="none"
          stroke-width={dimensions().stroke}
          stroke-linecap="round"
          stroke-dasharray={`${circumference()}`}
          stroke-dashoffset={strokeDashoffset()}
        />
      </svg>
      <Show when={props.showValue}>
        <span
          class="absolute text-surface-700 dark:text-surface-300 font-semibold"
          style={{
            'font-size': size() === 'sm' ? '0.5rem' : size() === 'md' ? '0.625rem' : '0.75rem',
          }}
        >
          {Math.round(clampedValue())}%
        </span>
      </Show>
    </div>
  );
};

export const Progress: Component<ProgressProps> = (props) => {
  const variant = () => props.variant ?? 'linear';

  return (
    <Show when={variant() === 'circular'} fallback={<LinearProgress {...props} />}>
      <CircularProgress {...props} />
    </Show>
  );
};
