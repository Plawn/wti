import type { Operation } from '@wti/core';
import type { Component } from 'solid-js';

interface OperationItemProps {
  operation: Operation;
  selected: boolean;
  onClick: () => void;
}

const methodConfig: Record<string, { bg: string; text: string; glow: string; activeBg: string }> = {
  get: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/15',
    activeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
  },
  post: {
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/15',
    activeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
  },
  put: {
    bg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/15',
    activeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
  },
  patch: {
    bg: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    glow: 'shadow-violet-500/15',
    activeBg: 'bg-violet-500/10 dark:bg-violet-500/15',
  },
  delete: {
    bg: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-rose-500/15',
    activeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
  },
  head: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/15',
    activeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
  },
  options: {
    bg: 'bg-gray-500',
    text: 'text-gray-600 dark:text-gray-400',
    glow: 'shadow-gray-500/15',
    activeBg: 'bg-gray-500/10 dark:bg-gray-500/15',
  },
};

const defaultConfig = {
  bg: 'bg-gray-500',
  text: 'text-gray-600 dark:text-gray-400',
  glow: 'shadow-gray-500/15',
  activeBg: 'bg-gray-500/10 dark:bg-gray-500/15',
};

export const OperationItem: Component<OperationItemProps> = (props) => {
  const config = () => methodConfig[props.operation.method] || defaultConfig;

  const containerClasses = () => {
    const base =
      'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-smooth cursor-pointer group';
    if (props.selected) {
      return `${base} ${config().activeBg} backdrop-blur-sm shadow-sm ${config().glow} ring-1 ring-white/30 dark:ring-white/10`;
    }
    return `${base} hover:bg-white/40 dark:hover:bg-white/5`;
  };

  const deprecatedClasses = () => (props.operation.deprecated ? 'opacity-50' : '');

  return (
    <button
      type="button"
      class={`${containerClasses()} ${deprecatedClasses()}`}
      onClick={props.onClick}
    >
      <span
        class={`${config().bg} text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg shadow-sm ${config().glow} flex-shrink-0`}
      >
        {props.operation.method}
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <span
          class={`block font-mono text-xs truncate ${props.selected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'} ${props.operation.deprecated ? 'line-through' : ''}`}
        >
          {props.operation.path}
        </span>
        {props.operation.summary && (
          <span class="block text-[11px] text-gray-400 dark:text-gray-500 truncate mt-1">
            {props.operation.summary}
          </span>
        )}
      </div>
    </button>
  );
};
