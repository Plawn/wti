import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Spinner } from './Spinner';
import type { ButtonProps, ButtonSize, ButtonVariant } from './types';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn-tertiary',
};

// Note: .btn-primary/.btn-secondary/.btn-tertiary already define padding in CSS
// These size classes only adjust when a non-default size is used
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'gap-2.5', // Default: use padding from CSS classes
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button: Component<ButtonProps> = (props) => {
  const variant = () => props.variant ?? 'primary';
  const size = () => props.size ?? 'md';

  return (
    <button
      type={props.type ?? 'button'}
      class={`${variantClasses[variant()]} ${sizeClasses[size()]} inline-flex items-center justify-center focus:outline-none focus-ring ${props.fullWidth ? 'w-full' : ''} ${props.class ?? ''}`}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      <Show when={props.loading}>
        <Spinner size={size()} />
      </Show>
      <Show when={!props.loading && props.leftIcon}>{props.leftIcon}</Show>
      {props.children}
      <Show when={props.rightIcon}>{props.rightIcon}</Show>
    </button>
  );
};
