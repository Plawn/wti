import type { Component } from 'solid-js';
import type { SelectProps } from './types';

/**
 * A glassmorphic select component with a custom dropdown indicator.
 *
 * @example
 * ```tsx
 * <Select
 *   value={selected()}
 *   onChange={setSelected}
 * >
 *   <option value="a">Option A</option>
 *   <option value="b">Option B</option>
 * </Select>
 * ```
 */
export const Select: Component<SelectProps> = (props) => {
  return (
    <div class="relative overflow-hidden">
      <select
        id={props.id}
        name={props.name}
        class={`w-full px-3 py-2 sm:py-2.5 glass-input text-sm text-surface-800 dark:text-surface-200 font-medium focus:outline-none cursor-pointer appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed truncate ${props.class ?? ''}`}
        value={props.value}
        disabled={props.disabled}
        required={props.required}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        style={{ 'text-overflow': 'ellipsis' }}
      >
        {props.children}
      </select>
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
