import type { Operation } from '@wti/core';
import type { Component } from 'solid-js';

interface OperationItemProps {
  operation: Operation;
  selected: boolean;
  onClick: () => void;
}

const methodConfig: Record<string, { bg: string; shadow: string }> = {
  get: {
    bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/20',
  },
  post: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
  },
  put: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
    shadow: 'shadow-amber-500/20',
  },
  patch: {
    bg: 'bg-gradient-to-r from-violet-500 to-violet-600',
    shadow: 'shadow-violet-500/20',
  },
  delete: {
    bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
    shadow: 'shadow-rose-500/20',
  },
  head: {
    bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    shadow: 'shadow-cyan-500/20',
  },
  options: {
    bg: 'bg-gradient-to-r from-surface-500 to-surface-600',
    shadow: 'shadow-surface-500/20',
  },
  grpc: {
    bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    shadow: 'shadow-indigo-500/20',
  },
};

const defaultConfig = {
  bg: 'bg-gradient-to-r from-surface-500 to-surface-600',
  shadow: 'shadow-surface-500/20',
};

export const OperationItem: Component<OperationItemProps> = (props) => {
  const config = () => methodConfig[props.operation.method.toLowerCase()] || defaultConfig;

  const containerClasses = () => {
    const base =
      'w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg transition-all duration-200 cursor-pointer group border border-transparent';
    if (props.selected) {
      return `${base} glass-active scale-[1.01]`;
    }
    return `${base} hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm`;
  };

  const deprecatedClasses = () => (props.operation.deprecated ? 'opacity-50' : '');

  return (
    <button
      type="button"
      class={`${containerClasses()} ${deprecatedClasses()}`}
      onClick={props.onClick}
    >
      <span
        class={`${config().bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${config().shadow} flex-shrink-0 text-center flex items-center justify-center`}
      >
        {props.operation.method}
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <span
          class={`block font-mono text-xs truncate ${props.selected ? 'text-surface-950 dark:text-white font-semibold' : 'text-surface-800 dark:text-surface-300 font-medium'} ${props.operation.deprecated ? 'line-through' : ''}`}
        >
          {props.operation.path}
        </span>
        {props.operation.summary && (
          <span class="block text-[0.6875rem] text-surface-700 dark:text-surface-400 truncate mt-0.5 font-medium">
            {props.operation.summary}
          </span>
        )}
      </div>
    </button>
  );
};
