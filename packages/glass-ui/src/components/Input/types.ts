import type { JSX } from 'solid-js';

/**
 * Size variants for input components
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Base props shared by text input components
 */
export interface BaseInputProps {
  /** Additional CSS classes */
  class?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** HTML id attribute */
  id?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: InputSize;
}

/**
 * Props for the Input component
 */
export interface InputProps extends BaseInputProps {
  /** Current input value */
  value: string;
  /** Callback when value changes */
  onInput: (value: string) => void;
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel' | 'search';
  /** Keyboard event handler */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** HTML name attribute */
  name?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Autocomplete attribute */
  autocomplete?: string;
  /** Whether the input is readonly */
  readonly?: boolean;
}

/**
 * Props for the Textarea component
 */
export interface TextareaProps extends BaseInputProps {
  /** Current textarea value */
  value: string;
  /** Callback when value changes */
  onInput: (value: string) => void;
  /** Number of visible text rows */
  rows?: number;
  /** HTML name attribute */
  name?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Whether the textarea is readonly */
  readonly?: boolean;
}

/**
 * Props for the Select component
 */
export interface SelectProps {
  /** Current selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Option elements */
  children: JSX.Element;
  /** Additional CSS classes */
  class?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** HTML id attribute */
  id?: string;
  /** HTML name attribute */
  name?: string;
  /** Whether the select is required */
  required?: boolean;
}

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checked state changes */
  onChange: (checked: boolean) => void;
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Additional CSS classes */
  class?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** HTML id attribute */
  id?: string;
  /** HTML name attribute */
  name?: string;
  /** Whether the checkbox is required */
  required?: boolean;
}
