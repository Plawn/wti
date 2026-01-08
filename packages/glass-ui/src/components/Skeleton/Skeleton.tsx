import type { Component } from 'solid-js';
import type { SkeletonProps, SkeletonVariant } from './types';

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
};

const defaultSizes: Record<SkeletonVariant, { width: string; height: string }> = {
  text: { width: '100%', height: '1em' },
  circular: { width: '2.5rem', height: '2.5rem' },
  rectangular: { width: '100%', height: '8rem' },
};

export const Skeleton: Component<SkeletonProps> = (props) => {
  const variant = () => props.variant ?? 'text';
  const defaults = () => defaultSizes[variant()];

  const width = () => props.width ?? defaults().width;
  const height = () => props.height ?? defaults().height;

  const borderRadius = () => {
    if (props.rounded === false) {
      return '';
    }
    return variantStyles[variant()];
  };

  return (
    <div
      class={`animate-pulse bg-surface-200/60 dark:bg-surface-700/40 ${borderRadius()} ${props.class ?? ''}`}
      style={{
        width: width(),
        height: height(),
      }}
      aria-hidden="true"
    />
  );
};
