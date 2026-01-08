import type { Component } from 'solid-js';
import { For, Show, createMemo, createSignal } from 'solid-js';
import type { SortDirection, SortState, TableProps } from './types';

// Sort icon component
const SortIcon: Component<{ direction: SortDirection; active: boolean }> = (props) => (
  <span
    class={`ml-1 inline-flex transition-opacity ${props.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
    aria-hidden="true"
  >
    <Show when={props.direction === 'asc'}>
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </Show>
    <Show when={props.direction === 'desc'}>
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </Show>
    <Show when={!props.direction}>
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
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    </Show>
  </span>
);

export function Table<T extends Record<string, unknown>>(
  props: Readonly<TableProps<T>>,
): ReturnType<Component> {
  const [internalSort, setInternalSort] = createSignal<SortState>({
    column: null,
    direction: null,
  });

  const currentSort = createMemo(() => props.sort ?? internalSort());

  const handleSort = (columnKey: string) => {
    const column = props.columns.find((c) => c.key === columnKey);
    if (!column?.sortable && !props.sortable) {
      return;
    }

    const current = currentSort();
    let newDirection: SortDirection = 'asc';

    if (current.column === columnKey) {
      if (current.direction === 'asc') {
        newDirection = 'desc';
      } else if (current.direction === 'desc') {
        newDirection = null;
      }
    }

    const newSort: SortState = {
      column: newDirection ? columnKey : null,
      direction: newDirection,
    };

    if (props.onSort) {
      props.onSort(newSort);
    } else {
      setInternalSort(newSort);
    }
  };

  const getCellValue = (row: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = row;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div class={`glass-card rounded-xl overflow-hidden ${props.class ?? ''}`}>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-200/50 dark:border-surface-700/50">
              <For each={props.columns}>
                {(column) => {
                  const isSortable = column.sortable ?? props.sortable;
                  const isActive = () => currentSort().column === column.key;
                  const sortDirection = () => (isActive() ? currentSort().direction : null);

                  return (
                    <th
                      class={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 ${alignClass(column.align)} ${isSortable ? 'cursor-pointer select-none group hover:text-surface-900 dark:hover:text-surface-200 transition-colors' : ''}`}
                      style={{ width: column.width }}
                      onClick={() => isSortable && handleSort(column.key)}
                      onKeyDown={(e) => {
                        if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleSort(column.key);
                        }
                      }}
                      tabindex={isSortable ? 0 : undefined}
                    >
                      <span class="inline-flex items-center">
                        {column.header}
                        <Show when={isSortable}>
                          <SortIcon direction={sortDirection()} active={isActive()} />
                        </Show>
                      </span>
                    </th>
                  );
                }}
              </For>
            </tr>
          </thead>
          <tbody>
            <Show
              when={props.data.length > 0}
              fallback={
                <tr>
                  <td
                    colspan={props.columns.length}
                    class="px-4 py-8 text-center text-surface-500 dark:text-surface-400"
                  >
                    {props.emptyMessage ?? 'No data available'}
                  </td>
                </tr>
              }
            >
              <For each={props.data}>
                {(row, index) => (
                  <tr class="border-b border-surface-100/50 dark:border-surface-800/50 last:border-b-0 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                    <For each={props.columns}>
                      {(column) => {
                        const value = getCellValue(row, column.key);
                        return (
                          <td
                            class={`px-4 py-3 text-sm text-surface-800 dark:text-surface-200 ${alignClass(column.align)}`}
                          >
                            <Show when={column.render} fallback={String(value ?? '')}>
                              {column.render?.(value, row, index())}
                            </Show>
                          </td>
                        );
                      }}
                    </For>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
