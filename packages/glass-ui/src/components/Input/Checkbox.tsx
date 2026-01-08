import { type Component, Show } from 'solid-js';
import type { CheckboxProps } from './types';

/**
 * A glassmorphic checkbox component with an optional label.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked()}
 *   onChange={setIsChecked}
 *   label="Accept terms and conditions"
 * />
 * ```
 */
export const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <label
      class={`inline-flex items-center gap-3 cursor-pointer ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${props.class ?? ''}`}
    >
      <div
        class={`w-5 h-5 flex items-center justify-center ${
          props.checked ? 'glass-checkbox-checked' : 'glass-checkbox'
        }`}
      >
        <input
          type="checkbox"
          id={props.id}
          name={props.name}
          checked={props.checked}
          disabled={props.disabled}
          required={props.required}
          onChange={(e) => props.onChange(e.currentTarget.checked)}
          class="sr-only"
        />
        <svg
          class={`w-3 h-3 text-white transition-all duration-200 ${props.checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <Show when={props.label}>
        <span class="text-sm text-gray-700 dark:text-gray-300">{props.label}</span>
      </Show>
    </label>
  );
};
