import type { Operation } from '@wti/core';
import type { Component } from 'solid-js';

interface OperationItemProps {
  operation: Operation;
  selected: boolean;
  onClick: () => void;
}

const methodConfig: Record<string, { bg: string; text: string; glow: string }> = {
  get: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  post: {
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  put: {
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  patch: {
    bg: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    glow: 'shadow-violet-500/20',
  },
  delete: {
    bg: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-rose-500/20',
  },
  head: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
  options: {
    bg: 'bg-gray-500',
    text: 'text-gray-600 dark:text-gray-400',
    glow: 'shadow-gray-500/20',
  },
};

const defaultConfig = {
  bg: 'bg-gray-500',
  text: 'text-gray-600 dark:text-gray-400',
  glow: 'shadow-gray-500/20',
};

export const OperationItem: Component<OperationItemProps> = (props) => {
  const config = () => methodConfig[props.operation.method] || defaultConfig;

  const containerClasses = () => {
    const base =
      'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-all duration-200 cursor-pointer group';
    if (props.selected) {
      return `${base} bg-white dark:bg-gray-800 shadow-md ${config().glow} ring-1 ring-gray-200/50 dark:ring-gray-700/50`;
    }
    return `${base} hover:bg-white/60 dark:hover:bg-gray-800/60`;
  };

  const deprecatedClasses = () => (props.operation.deprecated ? 'opacity-50' : '');

  return (
    <button
      type="button"
      class={`${containerClasses()} ${deprecatedClasses()}`}
      onClick={props.onClick}
    >
      <span
        class={`${config().bg} text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-sm ${config().glow} flex-shrink-0`}
      >
        {props.operation.method}
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <span
          class={`block font-mono text-xs truncate ${props.selected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'} ${props.operation.deprecated ? 'line-through' : ''}`}
        >
          {props.operation.path}
        </span>
        {props.operation.summary && (
          <span class="block text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {props.operation.summary}
          </span>
        )}
      </div>
    </button>
  );
};
