import type { Component, JSX } from 'solid-js';
import { Input } from '../../shared';

export interface AuthFormFieldProps {
  id: string;
  label: string;
  value: string;
  onInput: (value: string) => void;
  type?: 'text' | 'password';
  placeholder?: string;
  hint?: JSX.Element;
}

export const AuthFormField: Component<AuthFormFieldProps> = (props) => {
  return (
    <div>
      <label
        for={props.id}
        class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
      >
        {props.label}
      </label>
      <Input
        id={props.id}
        type={props.type ?? 'text'}
        value={props.value}
        onInput={props.onInput}
        placeholder={props.placeholder}
      />
      {props.hint}
    </div>
  );
};
