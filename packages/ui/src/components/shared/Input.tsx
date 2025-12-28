import type { Component, JSX } from 'solid-js';

export interface InputProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  class?: string;
  disabled?: boolean;
  id?: string;
}

export const Input: Component<InputProps> = (props) => {
  return (
    <input
      type={props.type ?? 'text'}
      id={props.id}
      class={`w-full px-5 py-2.5 glass-input text-sm text-gray-900 dark:text-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${props.class ?? ''}`}
      placeholder={props.placeholder}
      value={props.value}
      disabled={props.disabled}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
};

export interface TextareaProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  class?: string;
  rows?: number;
  disabled?: boolean;
}

export const Textarea: Component<TextareaProps> = (props) => {
  return (
    <textarea
      class={`w-full px-4 py-3 glass-input text-sm text-gray-800 dark:text-gray-200 resize-y focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${props.class ?? ''}`}
      placeholder={props.placeholder}
      value={props.value}
      rows={props.rows}
      disabled={props.disabled}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
};

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: JSX.Element;
  class?: string;
  disabled?: boolean;
  id?: string;
}

export const Select: Component<SelectProps> = (props) => {
  return (
    <div class="relative">
      <select
        id={props.id}
        class={`w-full px-4 py-2.5 glass-input text-sm text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed ${props.class ?? ''}`}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.currentTarget.value)}
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

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  class?: string;
  disabled?: boolean;
  id?: string;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <label
      class={`inline-flex items-center gap-3 cursor-pointer ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${props.class ?? ''}`}
    >
      <div class="relative">
        <input
          type="checkbox"
          id={props.id}
          checked={props.checked}
          disabled={props.disabled}
          onChange={(e) => props.onChange(e.currentTarget.checked)}
          class="sr-only peer"
        />
        <div class="w-5 h-5 rounded-md glass-input peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors flex items-center justify-center">
          <svg
            class={`w-3 h-3 text-white transition-opacity ${props.checked ? 'opacity-100' : 'opacity-0'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      {props.label && <span class="text-sm text-gray-700 dark:text-gray-300">{props.label}</span>}
    </label>
  );
};
