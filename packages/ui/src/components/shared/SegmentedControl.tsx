import { For, type JSX } from 'solid-js';

export interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string | JSX.Element;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
  /** Accessible label for the group */
  'aria-label'?: string;
}

export function SegmentedControl<T extends string | number>(props: SegmentedControlProps<T>) {
  const sizeClasses = () =>
    props.size === 'sm' ? 'px-2 py-1 text-[0.625rem]' : 'px-3 py-1.5 text-xs';

  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset has browser styling that breaks the design
    <div
      role="group"
      aria-label={props['aria-label']}
      class={`flex items-center gap-1 p-1 bg-surface-200/80 dark:bg-surface-800/80 rounded-xl w-fit ${
        props.className ?? ''
      }`}
    >
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            onClick={() => !option.disabled && props.onChange(option.value)}
            disabled={option.disabled}
            class={`${sizeClasses()} font-bold rounded-lg transition-all ${
              props.value === option.value
                ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
