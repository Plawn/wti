import { type Component, For, Show, createMemo } from 'solid-js';
import type { PaginationProps } from './types';

const ChevronLeftIcon: Component = () => (
  <svg
    class="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: Component = () => (
  <svg
    class="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const Pagination: Component<PaginationProps> = (props) => {
  const defaultPageSizeOptions = [10, 20, 50, 100];
  const pageSizeOptions = () => props.pageSizeOptions ?? defaultPageSizeOptions;

  const totalPages = createMemo(() => Math.ceil(props.total / props.pageSize));

  const canGoPrev = () => props.page > 1;
  const canGoNext = () => props.page < totalPages();

  const handlePrev = () => {
    if (canGoPrev()) {
      props.onChange(props.page - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      props.onChange(props.page + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== props.page) {
      props.onChange(page);
    }
  };

  const handlePageSizeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newPageSize = Number.parseInt(target.value, 10);
    props.onPageSizeChange?.(newPageSize);
    // Reset to page 1 when page size changes
    props.onChange(1);
  };

  // Generate page numbers to display
  const pageNumbers = createMemo(() => {
    const total = totalPages();
    const current = props.page;
    const pages: (number | 'ellipsis')[] = [];

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  });

  const buttonBaseClass =
    'inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors';
  const buttonInactiveClass =
    'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5';
  const buttonActiveClass = 'glass-active text-gray-900 dark:text-white';
  const buttonDisabledClass = 'text-gray-300 dark:text-gray-600 cursor-not-allowed';

  return (
    <div class={`flex items-center gap-4 ${props.class ?? ''}`}>
      {/* Page size selector */}
      <Show when={props.showPageSize}>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
          <select
            value={props.pageSize}
            onChange={handlePageSizeChange}
            class="glass-input px-2 py-1 text-sm rounded-lg"
          >
            <For each={pageSizeOptions()}>{(size) => <option value={size}>{size}</option>}</For>
          </select>
          <span class="text-sm text-gray-600 dark:text-gray-400">per page</span>
        </div>
      </Show>

      {/* Pagination controls */}
      <div class="flex items-center gap-1">
        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev()}
          class={`${buttonBaseClass} ${canGoPrev() ? buttonInactiveClass : buttonDisabledClass}`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        {/* Page numbers */}
        <For each={pageNumbers()}>
          {(page) => (
            <Show
              when={page !== 'ellipsis'}
              fallback={
                <span class="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  ...
                </span>
              }
            >
              <button
                type="button"
                onClick={() => handlePageClick(page as number)}
                class={`${buttonBaseClass} ${
                  props.page === page ? buttonActiveClass : buttonInactiveClass
                }`}
                aria-label={`Page ${page}`}
                aria-current={props.page === page ? 'page' : undefined}
              >
                {page}
              </button>
            </Show>
          )}
        </For>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext()}
          class={`${buttonBaseClass} ${canGoNext() ? buttonInactiveClass : buttonDisabledClass}`}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Page info */}
      <Show when={props.total > 0}>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {(props.page - 1) * props.pageSize + 1}-
          {Math.min(props.page * props.pageSize, props.total)} of {props.total}
        </span>
      </Show>
    </div>
  );
};
