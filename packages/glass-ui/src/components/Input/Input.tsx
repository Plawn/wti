import type { Component } from 'solid-js';
import type { InputProps, InputSize } from './types';

/**
 * Get size-specific classes for the input
 */
const getSizeClasses = (size: InputSize): string => {
  switch (size) {
    case 'sm':
      return 'px-2.5 py-1.5 text-xs';
    case 'lg':
      return 'px-4 py-3 text-base';
    default:
      return 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm';
  }
};

/**
 * A glassmorphic text input component with size variants.
 *
 * @example
 * ```tsx
 * <Input
 *   value={value()}
 *   onInput={setValue}
 *   placeholder="Enter text..."
 *   size="md"
 * />
 * ```
 */
export const Input: Component<InputProps> = (props) => {
  const sizeClasses = () => getSizeClasses(props.size ?? 'md');

  return (
    <input
      type={props.type ?? 'text'}
      id={props.id}
      name={props.name}
      class={`w-full glass-input text-surface-900 dark:text-surface-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses()} ${props.class ?? ''}`}
      placeholder={props.placeholder}
      value={props.value}
      disabled={props.disabled}
      readonly={props.readonly}
      required={props.required}
      autocomplete={props.autocomplete}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      onKeyDown={props.onKeyDown}
    />
  );
};
