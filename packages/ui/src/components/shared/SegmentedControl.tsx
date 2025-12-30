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
}

export function SegmentedControl<T extends string | number>(props: SegmentedControlProps<T>) {
  const sizeClasses = () => (props.size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs');

  return (
    <div
      class={`flex items-center gap-1 p-1 bg-surface-100/50 dark:bg-surface-800/50 rounded-xl w-fit ${
        props.className ?? ''
      }`}
    >
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            onClick={() => !option.disabled && props.onChange(option.value)}
            disabled={option.disabled}
            class={`${sizeClasses()} font-medium rounded-lg transition-all ${
              props.value === option.value
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50'
            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
