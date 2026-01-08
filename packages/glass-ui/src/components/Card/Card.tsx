import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import type { CardProps, CardVariant } from './types';

const variantStyles: Record<CardVariant, string> = {
  default: 'glass-card',
  elevated: 'glass-card shadow-lg dark:shadow-2xl',
  outlined: 'bg-transparent border border-surface-200 dark:border-surface-700',
};

export const Card: Component<CardProps> = (props) => {
  const variant = () => props.variant ?? 'default';

  return (
    <div class={`rounded-xl overflow-hidden ${variantStyles[variant()]} ${props.class ?? ''}`}>
      <Show when={props.header}>
        <div class="px-4 py-3 border-b border-surface-200/50 dark:border-surface-700/50">
          {props.header}
        </div>
      </Show>

      <div class="p-4">{props.children}</div>

      <Show when={props.footer}>
        <div class="px-4 py-3 border-t border-surface-200/50 dark:border-surface-700/50 bg-surface-50/30 dark:bg-surface-900/30">
          {props.footer}
        </div>
      </Show>
    </div>
  );
};
