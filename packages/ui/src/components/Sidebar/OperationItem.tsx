import type { Operation } from '@wti/core';
import type { Component } from 'solid-js';

interface OperationItemProps {
  operation: Operation;
  selected: boolean;
  onClick: () => void;
}

const methodStyles: Record<string, { background: string; boxShadow: string }> = {
  get: {
    background: 'linear-gradient(to right, #10b981, #059669)',
    boxShadow: '0 2px 8px -2px rgba(16, 185, 129, 0.3)',
  },
  post: {
    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
    boxShadow: '0 2px 8px -2px rgba(59, 130, 246, 0.3)',
  },
  put: {
    background: 'linear-gradient(to right, #f59e0b, #d97706)',
    boxShadow: '0 2px 8px -2px rgba(245, 158, 11, 0.3)',
  },
  patch: {
    background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
    boxShadow: '0 2px 8px -2px rgba(139, 92, 246, 0.3)',
  },
  delete: {
    background: 'linear-gradient(to right, #ef4444, #dc2626)',
    boxShadow: '0 2px 8px -2px rgba(239, 68, 68, 0.3)',
  },
  head: {
    background: 'linear-gradient(to right, #06b6d4, #0891b2)',
    boxShadow: '0 2px 8px -2px rgba(6, 182, 212, 0.3)',
  },
  options: {
    background: 'linear-gradient(to right, #6b7280, #4b5563)',
    boxShadow: '0 2px 8px -2px rgba(107, 114, 128, 0.3)',
  },
};

const defaultStyle = {
  background: 'linear-gradient(to right, #6b7280, #4b5563)',
  boxShadow: '0 2px 8px -2px rgba(107, 114, 128, 0.3)',
};

export const OperationItem: Component<OperationItemProps> = (props) => {
  const badgeStyle = () => methodStyles[props.operation.method] || defaultStyle;

  const containerClasses = () => {
    const base =
      'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-all duration-200 cursor-pointer group border border-transparent';
    if (props.selected) {
      return `${base} glass-active scale-[1.02]`;
    }
    return `${base} hover:bg-white/40 dark:hover:bg-white/5 hover:scale-[1.01] hover:shadow-sm`;
  };

  const deprecatedClasses = () => (props.operation.deprecated ? 'opacity-50' : '');

  return (
    <button
      type="button"
      class={`${containerClasses()} ${deprecatedClasses()}`}
      onClick={props.onClick}
    >
      <span
        class="text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg flex-shrink-0"
        style={badgeStyle()}
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
