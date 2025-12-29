import type { Operation } from '@wti/core';
import { type Component, For, Show, createMemo } from 'solid-js';
import { useI18n } from '../../i18n';
import { OperationItem } from './OperationItem';

interface OperationTreeProps {
  operations: Operation[];
  expandedTags: Set<string>;
  selectedOperationId: string | null;
  searchQuery: string;
  onToggleTag: (tag: string) => void;
  onSelectOperation: (operation: Operation) => void;
}

interface TagGroup {
  name: string;
  operations: Operation[];
}

export const OperationTree: Component<OperationTreeProps> = (props) => {
  const { t } = useI18n();

  const filteredOperations = createMemo(() => {
    const query = props.searchQuery.toLowerCase().trim();
    if (!query) return props.operations;

    return props.operations.filter((op) => {
      return (
        op.path.toLowerCase().includes(query) ||
        op.summary?.toLowerCase().includes(query) ||
        op.id.toLowerCase().includes(query) ||
        op.method.toLowerCase().includes(query)
      );
    });
  });

  const tagGroups = createMemo(() => {
    const groups = new Map<string, Operation[]>();
    const defaultTag = 'default';

    for (const op of filteredOperations()) {
      const tags = op.tags.length > 0 ? op.tags : [defaultTag];
      for (const tag of tags) {
        if (!groups.has(tag)) {
          groups.set(tag, []);
        }
        groups.get(tag)?.push(op);
      }
    }

    const result: TagGroup[] = [];
    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
      if (a === defaultTag) return 1;
      if (b === defaultTag) return -1;
      return a.localeCompare(b);
    });

    for (const name of sortedKeys) {
      const ops = groups.get(name);
      if (ops) {
        result.push({ name, operations: ops });
      }
    }

    return result;
  });

  return (
    <div class="h-full overflow-y-auto scrollbar-thin py-4 px-5">
      <Show
        when={filteredOperations().length > 0}
        fallback={
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-14 h-14 rounded-2xl glass-button flex items-center justify-center mb-4">
              <svg
                class="w-7 h-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t('common.noResults')}
            </p>
          </div>
        }
      >
        <div class="space-y-5">
          <For each={tagGroups()}>
            {(group) => (
              <TagGroupComponent
                group={group}
                expanded={props.expandedTags.has(group.name)}
                selectedOperationId={props.selectedOperationId}
                onToggle={() => props.onToggleTag(group.name)}
                onSelectOperation={props.onSelectOperation}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

interface TagGroupComponentProps {
  group: TagGroup;
  expanded: boolean;
  selectedOperationId: string | null;
  onToggle: () => void;
  onSelectOperation: (operation: Operation) => void;
}

const TagGroupComponent: Component<TagGroupComponentProps> = (props) => {
  return (
    <div>
      <button
        type="button"
        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-smooth group"
        onClick={props.onToggle}
      >
        <div
          class={`w-6 h-6 rounded-lg flex items-center justify-center transition-smooth ${props.expanded ? 'bg-blue-500/15 dark:bg-blue-500/20' : 'glass-button'}`}
        >
          <ChevronIcon expanded={props.expanded} />
        </div>
        <span class="flex-1 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">
          {props.group.name}
        </span>
        <span class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 tabular-nums px-2 py-0.5 rounded-md glass-button">
          {props.group.operations.length}
        </span>
      </button>
      <Show when={props.expanded}>
        <div class="mt-3 ml-3 pl-4 border-l border-gray-200/50 dark:border-gray-700/30 space-y-3">
          <For each={props.group.operations}>
            {(operation) => (
              <OperationItem
                operation={operation}
                selected={operation.id === props.selectedOperationId}
                onClick={() => props.onSelectOperation(operation)}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

const ChevronIcon: Component<{ expanded: boolean }> = (props) => {
  return (
    <svg
      class={`w-3 h-3 transition-transform duration-200 ${props.expanded ? 'rotate-90 text-blue-500' : 'text-gray-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
};
