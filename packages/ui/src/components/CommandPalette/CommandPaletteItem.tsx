import type { Operation } from '@wti/core';
import { type Component, For, Show } from 'solid-js';
import type { FuseMatch } from '../../utils';

interface CommandPaletteItemProps {
  operation: Operation;
  selected: boolean;
  matches?: readonly FuseMatch[];
  isRecent?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

// Highlight matched characters in text
const HighlightedText: Component<{
  text: string;
  matches?: readonly FuseMatch[];
  fieldKey: string;
}> = (props) => {
  const getHighlightedParts = () => {
    const match = props.matches?.find((m) => m.key === props.fieldKey);
    if (!match?.indices?.length) {
      return [{ text: props.text, highlight: false }];
    }

    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;

    for (const [start, end] of match.indices) {
      if (start > lastIndex) {
        parts.push({ text: props.text.slice(lastIndex, start), highlight: false });
      }
      parts.push({ text: props.text.slice(start, end + 1), highlight: true });
      lastIndex = end + 1;
    }

    if (lastIndex < props.text.length) {
      parts.push({ text: props.text.slice(lastIndex), highlight: false });
    }

    return parts;
  };

  return (
    <For each={getHighlightedParts()}>
      {(part) => (
        <Show when={part.highlight} fallback={part.text}>
          <span class="text-accent-500 font-semibold">{part.text}</span>
        </Show>
      )}
    </For>
  );
};

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
    bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
    shadow: 'shadow-gray-500/20',
  },
  grpc: {
    bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    shadow: 'shadow-indigo-500/20',
  },
};

const defaultConfig = {
  bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
  shadow: 'shadow-gray-500/20',
};

export const CommandPaletteItem: Component<CommandPaletteItemProps> = (props) => {
  const config = () => methodConfig[props.operation.method.toLowerCase()] || defaultConfig;

  return (
    <button
      type="button"
      class={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 rounded-lg mx-1 my-0.5 ${
        props.selected
          ? 'bg-accent-500/15 dark:bg-accent-500/20'
          : 'hover:bg-black/5 dark:hover:bg-white/5'
      }`}
      style={{ width: 'calc(100% - 8px)' }}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      <Show when={props.isRecent}>
        <svg
          class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Recently used"
        >
          <title>Recently used</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Show>
      <span
        class={`${config().bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${config().shadow} flex-shrink-0 text-center`}
      >
        {props.operation.method}
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <span
          class={`block font-mono text-xs truncate text-gray-700 dark:text-gray-200 ${props.operation.deprecated ? 'line-through opacity-50' : ''}`}
        >
          <HighlightedText text={props.operation.path} matches={props.matches} fieldKey="path" />
        </span>
        <Show when={props.operation.summary} keyed>
          {(summary) => (
            <span class="block text-[0.6875rem] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              <HighlightedText text={summary} matches={props.matches} fieldKey="summary" />
            </span>
          )}
        </Show>
      </div>
    </button>
  );
};
