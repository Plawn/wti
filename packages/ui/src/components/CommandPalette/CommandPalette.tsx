import type { Operation } from '@wti/core';
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { useIsDark } from '../../hooks/useIsDark';
import { useI18n } from '../../i18n';
import { getLocalStorageItem, setLocalStorageItem } from '../../storage';
import {
  type OperationSearchResult,
  createOperationSearch,
  searchOperations,
} from '../../utils/search';
import { CommandPaletteItem } from './CommandPaletteItem';

const RECENT_STORAGE_KEY = 'wti:recent-operations';
const MAX_RECENT = 8;

// Get unique key for an operation
const getOperationKey = (op: Operation) => `${op.method}:${op.path}`;

// Load recent operation keys from storage
const loadRecentKeys = (): string[] => getLocalStorageItem<string[]>(RECENT_STORAGE_KEY, []);

// Save recent operation keys to storage
const saveRecentKeys = (keys: string[]) => {
  setLocalStorageItem(RECENT_STORAGE_KEY, keys.slice(0, MAX_RECENT));
};

// Add an operation to recent list
const addToRecent = (op: Operation) => {
  const key = getOperationKey(op);
  const recent = loadRecentKeys().filter((k) => k !== key);
  saveRecentKeys([key, ...recent]);
};

interface SearchResult extends OperationSearchResult {
  isRecent?: boolean;
}

export interface CommandPaletteHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

export interface CommandPaletteProps {
  operations: Operation[];
  onSelectOperation: (operation: Operation) => void;
  /** Optional search function from store (uses memoized Fuse instance) */
  searchFn?: (query: string, limit?: number) => OperationSearchResult[];
  /** Keyboard shortcut key (default: 'p' for Cmd/Ctrl+P) */
  shortcutKey?: string;
  /** Disable the keyboard shortcut */
  disableShortcut?: boolean;
  /** Callback to get a handle for programmatic control */
  ref?: (handle: CommandPaletteHandle) => void;
}

export const CommandPalette: Component<CommandPaletteProps> = (props) => {
  const { t } = useI18n();
  const isDark = useIsDark();
  const [isOpen, setIsOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [recentKeys, setRecentKeys] = createSignal<string[]>(loadRecentKeys());
  const [mouseEnabled, setMouseEnabled] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;
  let listRef: HTMLDivElement | undefined;

  // Handle API
  const handle: CommandPaletteHandle = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
    isOpen,
  };

  // Expose handle via ref callback
  onMount(() => {
    props.ref?.(handle);
  });

  // Global keyboard shortcut
  onMount(() => {
    if (props.disableShortcut) {
      return;
    }

    const shortcutKey = props.shortcutKey ?? 'p';
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        if (props.operations.length > 0) {
          setIsOpen((open) => !open);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleGlobalKeyDown));
  });

  // Build a map for quick operation lookup
  const operationByKey = createMemo(() => {
    const map = new Map<string, Operation>();
    for (const op of props.operations) {
      map.set(getOperationKey(op), op);
    }
    return map;
  });

  // Internal Fuse instance (only created if no external searchFn provided)
  const internalFuse = createMemo(() => {
    if (props.searchFn) {
      return null;
    }
    if (props.operations.length === 0) {
      return null;
    }
    return createOperationSearch(props.operations);
  });

  const searchResults = createMemo((): SearchResult[] => {
    const q = query().trim();

    if (!q) {
      // Show recent operations first, then others
      const keys = recentKeys();
      const opMap = operationByKey();
      const recentOps: SearchResult[] = [];
      const seenKeys = new Set<string>();

      for (const key of keys) {
        const op = opMap.get(key);
        if (op) {
          recentOps.push({ operation: op, isRecent: true });
          seenKeys.add(key);
        }
      }

      // Fill with non-recent operations
      const remaining = props.operations
        .filter((op) => !seenKeys.has(getOperationKey(op)))
        .slice(0, 50 - recentOps.length)
        .map((op) => ({ operation: op }));

      return [...recentOps, ...remaining];
    }

    // Use external search function if provided
    if (props.searchFn) {
      return props.searchFn(q);
    }

    // Fall back to internal Fuse instance
    const fuse = internalFuse();
    if (fuse) {
      return searchOperations(fuse, q);
    }

    return [];
  });

  // Reset selection when results change
  createEffect(() => {
    searchResults();
    setSelectedIndex(0);
  });

  // Focus input and reset state when opened
  createEffect(() => {
    if (isOpen()) {
      setQuery('');
      setSelectedIndex(0);
      setMouseEnabled(false); // Disable mouse selection until actual movement
      setRecentKeys(loadRecentKeys()); // Refresh recent from localStorage
      // Small delay to ensure the element is rendered
      requestAnimationFrame(() => {
        inputRef?.focus();
      });
    }
  });

  // Scroll selected item into view
  createEffect(() => {
    const index = selectedIndex();
    if (listRef && isOpen()) {
      const item = listRef.children[index] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }
  });

  const handleClose = () => setIsOpen(false);

  const handleSelect = (result: SearchResult) => {
    addToRecent(result.operation);
    setRecentKeys(loadRecentKeys()); // Update signal to reflect new recent
    props.onSelectOperation(result.operation);
    handleClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, searchResults().length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        e.preventDefault();
        const selected = searchResults()[selectedIndex()];
        if (selected) {
          handleSelect(selected);
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <Show when={isOpen()}>
      <Portal>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handled in input */}
        <div
          class={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20 dark:bg-black/40 backdrop-blur-md animate-in fade-in duration-200 ${isDark() ? 'dark' : ''}`}
          onClick={handleBackdropClick}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Non-interactive container */}
          <div
            class="w-full max-w-xl mx-4 glass-thick rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div class="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/5">
              <svg
                class="w-5 h-5 text-gray-400"
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
              <input
                ref={inputRef}
                type="text"
                class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
                placeholder={t('commandPalette.placeholder')}
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
              />
              <kbd class="hidden sm:inline-flex px-2 py-1 text-[0.625rem] font-mono text-gray-400 glass-button rounded">
                esc
              </kbd>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              class="max-h-[50vh] overflow-y-auto scrollbar-thin py-1"
              onMouseMove={() => setMouseEnabled(true)}
            >
              <Show
                when={searchResults().length > 0}
                fallback={
                  <div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    {t('commandPalette.noResults')}
                  </div>
                }
              >
                <For each={searchResults()}>
                  {(result, index) => (
                    <CommandPaletteItem
                      operation={result.operation}
                      selected={index() === selectedIndex()}
                      matches={result.matches}
                      isRecent={result.isRecent}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => mouseEnabled() && setSelectedIndex(index())}
                    />
                  )}
                </For>
              </Show>
            </div>

            {/* Footer hint */}
            <div class="px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 glass-button rounded text-[0.625rem]">
                  <span class="font-mono">↑↓</span>
                </kbd>
                {t('commandPalette.navigate')}
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 glass-button rounded text-[0.625rem]">
                  <span class="font-mono">↵</span>
                </kbd>
                {t('commandPalette.select')}
              </span>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
