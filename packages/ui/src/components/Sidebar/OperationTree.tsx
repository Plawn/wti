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
    <div class="h-full overflow-y-auto scrollbar-thin py-2 px-3">
      <Show
        when={filteredOperations().length > 0}
        fallback={
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <svg
                class="w-6 h-6 text-gray-400"
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
            <p class="text-sm text-gray-500 dark:text-gray-400">{t('common.noResults')}</p>
          </div>
        }
      >
        <div class="space-y-1">
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
        class="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors group"
        onClick={props.onToggle}
      >
        <div
          class={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${props.expanded ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          <ChevronIcon expanded={props.expanded} />
        </div>
        <span class="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
          {props.group.name}
        </span>
        <span class="text-[11px] font-medium text-gray-400 dark:text-gray-500 tabular-nums">
          {props.group.operations.length}
        </span>
      </button>
      <Show when={props.expanded}>
        <div class="mt-1 ml-2 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1">
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
