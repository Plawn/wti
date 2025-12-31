import type { Component, JSX } from 'solid-js';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn-tertiary',
};

export const Button: Component<ButtonProps> = (props) => {
  const variant = () => props.variant ?? 'primary';

  return (
    <button
      type={props.type ?? 'button'}
      class={`${variantClasses[variant()]} inline-flex items-center justify-center gap-2.5 focus:outline-none focus-ring ${props.class ?? ''}`}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading && <Spinner />}
      {props.children}
    </button>
  );
};

const Spinner: Component = () => (
  <svg
    class="animate-spin h-[1.125rem] w-[1.125rem]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
