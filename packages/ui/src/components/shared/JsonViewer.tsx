import { type Component, For, Show, createMemo, createSignal } from 'solid-js';
import { useCopyToClipboard } from '../../hooks';
import { useI18n } from '../../i18n';
import { formatJson } from '../../utils';

export interface JsonViewerProps {
  data: unknown;
  maxHeight?: string;
  /** Initial expand depth (default: 2) */
  initialExpandDepth?: number;
  class?: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonNodeProps {
  keyName?: string;
  value: JsonValue;
  depth: number;
  initialExpandDepth: number;
  isLast: boolean;
}

const getValueType = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
};

const getValueColor = (type: string): string => {
  switch (type) {
    case 'string':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'number':
      return 'text-blue-600 dark:text-blue-400';
    case 'boolean':
      return 'text-amber-600 dark:text-amber-400';
    case 'null':
      return 'text-gray-500 dark:text-gray-500';
    default:
      return 'text-gray-800 dark:text-gray-200';
  }
};

const JsonNode: Component<JsonNodeProps> = (props) => {
  const type = () => getValueType(props.value);
  const isExpandable = () => type() === 'object' || type() === 'array';
  const [expanded, setExpanded] = createSignal(props.depth < props.initialExpandDepth);

  const entries = createMemo(() => {
    if (type() === 'array') {
      return (props.value as JsonValue[]).map((v, i) => [String(i), v] as [string, JsonValue]);
    }
    if (type() === 'object' && props.value !== null) {
      return Object.entries(props.value as Record<string, JsonValue>);
    }
    return [];
  });

  const itemCount = () => entries().length;
  const brackets = () => (type() === 'array' ? ['[', ']'] : ['{', '}']);

  const renderPrimitive = () => {
    const t = type();
    const colorClass = getValueColor(t);

    if (t === 'string') {
      return <span class={colorClass}>"{String(props.value)}"</span>;
    }
    if (t === 'null') {
      return <span class={colorClass}>null</span>;
    }
    if (t === 'boolean') {
      return <span class={colorClass}>{props.value ? 'true' : 'false'}</span>;
    }
    return <span class={colorClass}>{String(props.value)}</span>;
  };

  return (
    <div class="font-mono text-sm leading-relaxed">
      <div class="flex items-start">
        {/* Expand/collapse toggle */}
        <Show when={isExpandable()}>
          <button
            type="button"
            onClick={() => setExpanded(!expanded())}
            class="w-4 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 -ml-4"
            aria-label={expanded() ? 'Collapse' : 'Expand'}
          >
            <svg
              class={`w-3 h-3 transition-transform duration-150 ${expanded() ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Show>
        <Show when={!isExpandable()}>
          <span class="w-4 flex-shrink-0" />
        </Show>

        {/* Key name */}
        <Show when={props.keyName !== undefined}>
          <span class="text-violet-600 dark:text-violet-400">"{props.keyName}"</span>
          <span class="text-gray-500 dark:text-gray-400 mx-1">:</span>
        </Show>

        {/* Value */}
        <Show
          when={isExpandable()}
          fallback={
            <>
              {renderPrimitive()}
              <Show when={!props.isLast}>
                <span class="text-gray-500 dark:text-gray-400">,</span>
              </Show>
            </>
          }
        >
          <Show
            when={expanded()}
            fallback={
              <>
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {brackets()[0]}
                  <span class="mx-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    {itemCount()} {itemCount() === 1 ? 'item' : 'items'}
                  </span>
                  {brackets()[1]}
                </button>
                <Show when={!props.isLast}>
                  <span class="text-gray-500 dark:text-gray-400">,</span>
                </Show>
              </>
            }
          >
            <span class="text-gray-500 dark:text-gray-400">{brackets()[0]}</span>
          </Show>
        </Show>
      </div>

      {/* Children */}
      <Show when={isExpandable() && expanded()}>
        <div class="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">
          <For each={entries()}>
            {([key, val], index) => (
              <JsonNode
                keyName={type() === 'object' ? key : undefined}
                value={val}
                depth={props.depth + 1}
                initialExpandDepth={props.initialExpandDepth}
                isLast={index() === itemCount() - 1}
              />
            )}
          </For>
        </div>
        <div class="flex items-center">
          <span class="w-4 flex-shrink-0" />
          <span class="text-gray-500 dark:text-gray-400">{brackets()[1]}</span>
          <Show when={!props.isLast}>
            <span class="text-gray-500 dark:text-gray-400">,</span>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export const JsonViewer: Component<JsonViewerProps> = (props) => {
  const { t } = useI18n();
  const { copied, copy } = useCopyToClipboard();

  const maxHeight = () => props.maxHeight ?? '31.25rem';
  const initialExpandDepth = () => props.initialExpandDepth ?? 2;

  const jsonString = createMemo(() => formatJson(props.data));

  const [expandAll, setExpandAll] = createSignal(false);
  const [key, setKey] = createSignal(0);

  const handleExpandAll = () => {
    setExpandAll(true);
    setKey((k) => k + 1);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setKey((k) => k + 1);
  };

  return (
    <div class={`relative group rounded-xl overflow-hidden ${props.class ?? ''}`}>
      {/* Toolbar */}
      <div class="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleExpandAll}
          class="px-2 py-1 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"
          title="Expand all"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleCollapseAll}
          class="px-2 py-1 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"
          title="Collapse all"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => copy(jsonString())}
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"
        >
          <Show
            when={copied()}
            fallback={
              <>
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t('common.copy')}
              </>
            }
          >
            <svg
              class="w-3.5 h-3.5 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-emerald-600 dark:text-emerald-400">{t('common.copied')}</span>
          </Show>
        </button>
      </div>

      {/* JSON content */}
      <div
        class="p-6 pt-10 overflow-auto scrollbar-thin bg-surface-50/50 dark:bg-surface-900/50"
        style={{ 'max-height': maxHeight() }}
      >
        <Show when={key() >= 0} keyed>
          {(_) => (
            <div class="pl-4">
              <JsonNode
                value={props.data as JsonValue}
                depth={0}
                initialExpandDepth={expandAll() ? 100 : initialExpandDepth()}
                isLast
              />
            </div>
          )}
        </Show>
      </div>
    </div>
  );
};
