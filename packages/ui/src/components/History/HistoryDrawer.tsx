/**
 * History Drawer
 *
 * Shows request history in a slide-out drawer
 * Keyboard shortcuts:
 * - Cmd/Ctrl+H: Toggle drawer
 * - Arrow Up/Down: Navigate entries
 * - Enter: Replay selected entry
 * - Backspace/Delete: Remove selected entry
 */

import type { Component } from 'solid-js';
import { For, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { useI18n } from '../../i18n';
import type { HistoryEntry, HistoryStore } from '../../stores';
import { getStatusIndicatorColor, getStatusTextColor } from '../../utils';
import { Drawer } from '../shared';

interface HistoryDrawerProps {
  store: HistoryStore;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onReplay?: (entry: HistoryEntry) => void;
}

export const HistoryDrawer: Component<HistoryDrawerProps> = (props) => {
  const { t } = useI18n();
  const [confirmClear, setConfirmClear] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [isKeyboardNav, setIsKeyboardNav] = createSignal(false);
  let listRef: HTMLDivElement | undefined;

  // Reset selection when drawer opens
  createEffect(() => {
    if (props.open) {
      setSelectedIndex(0);
      setIsKeyboardNav(false);
    }
  });

  // Global keyboard shortcut: Cmd/Ctrl+H to toggle
  onMount(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        if (props.open) {
          props.onClose();
        } else {
          props.onOpen();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleGlobalKeyDown));
  });

  // Keyboard navigation when drawer is open
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!props.open) {
      return;
    }

    const entries = props.store.state.entries;
    if (entries.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsKeyboardNav(true);
        setSelectedIndex((i) => Math.min(i + 1, entries.length - 1));
        scrollSelectedIntoView();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIsKeyboardNav(true);
        setSelectedIndex((i) => Math.max(i - 1, 0));
        scrollSelectedIntoView();
        break;
      case 'Enter': {
        e.preventDefault();
        const selectedEntry = entries[selectedIndex()];
        if (selectedEntry && props.onReplay) {
          props.onReplay(selectedEntry);
        }
        break;
      }
      case 'Backspace':
      case 'Delete': {
        e.preventDefault();
        const entryToDelete = entries[selectedIndex()];
        if (entryToDelete) {
          props.store.actions.removeEntry(entryToDelete.id);
          // Adjust selection if we deleted the last item
          if (selectedIndex() >= entries.length - 1) {
            setSelectedIndex((i) => Math.max(i - 1, 0));
          }
        }
        break;
      }
    }
  };

  // Attach keyboard listener when drawer is open
  createEffect(() => {
    if (props.open) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  const scrollSelectedIntoView = () => {
    requestAnimationFrame(() => {
      const selected = listRef?.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };

  const handleMouseMove = () => {
    setIsKeyboardNav(false);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  const getStatusColor = (entry: HistoryEntry): string =>
    getStatusIndicatorColor(entry.response?.status, !!entry.error);

  const getMethodStyle = (method: string): { bg: string; shadow: string } => {
    const styles: Record<string, { bg: string; shadow: string }> = {
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
      grpc: {
        bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
        shadow: 'shadow-indigo-500/20',
      },
    };
    return (
      styles[method.toLowerCase()] || {
        bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
        shadow: 'shadow-gray-500/20',
      }
    );
  };

  const handleClear = async () => {
    if (confirmClear()) {
      await props.store.actions.clearHistory();
      setConfirmClear(false);
      setSelectedIndex(0);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleExport = async () => {
    const json = await props.store.actions.exportHistory();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wti-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        props.store.actions.importHistory(text);
      }
    };
    input.click();
  };

  return (
    <Drawer
      open={props.open}
      onClose={props.onClose}
      title={t('history.title')}
      position="right"
      size="lg"
      noPadding
    >
      <div class="flex flex-col h-full">
        {/* Actions */}
        <div class="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              class="px-3 py-1.5 text-xs font-bold glass-button rounded-lg text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-white"
            >
              {t('history.export')}
            </button>
            <button
              type="button"
              onClick={handleImport}
              class="px-3 py-1.5 text-xs font-bold glass-button rounded-lg text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-white"
            >
              {t('history.import')}
            </button>
          </div>
          <button
            type="button"
            onClick={handleClear}
            class={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              confirmClear()
                ? 'bg-red-500 text-white'
                : 'glass-button text-surface-700 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            {confirmClear() ? 'Confirm?' : t('history.clearAll')}
          </button>
        </div>

        {/* History list */}
        <div
          ref={listRef}
          class="flex-1 overflow-y-auto scrollbar-thin"
          onMouseMove={handleMouseMove}
        >
          <Show
            when={props.store.state.entries.length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
                <svg
                  class="w-12 h-12 mb-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="text-sm">{t('history.empty')}</p>
              </div>
            }
          >
            <div class="divide-y divide-black/5 dark:divide-white/5">
              <For each={props.store.state.entries}>
                {(entry, index) => {
                  const methodStyle = getMethodStyle(entry.operationMethod);
                  const isSelected = () => isKeyboardNav() && selectedIndex() === index();
                  return (
                    <div
                      data-selected={isSelected()}
                      class={`px-4 py-3 transition-all duration-200 ${
                        isSelected()
                          ? 'glass-active scale-[1.01]'
                          : 'hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm'
                      }`}
                      onMouseEnter={() => {
                        if (!isKeyboardNav()) {
                          setSelectedIndex(index());
                        }
                      }}
                    >
                      <div class="flex items-start gap-3">
                        {/* Status indicator */}
                        <div
                          class={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(entry)}`}
                        />

                        {/* Method badge */}
                        <span
                          class={`${methodStyle.bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${methodStyle.shadow} flex-shrink-0 text-center`}
                        >
                          {entry.operationMethod.toUpperCase()}
                        </span>

                        {/* Content */}
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <p class="text-sm font-mono font-bold text-surface-800 dark:text-surface-300 truncate">
                              {entry.operationPath}
                            </p>
                          </div>
                          <div class="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-500 font-bold">
                            <span>{formatTime(entry.timestamp)}</span>
                            <Show when={entry.response} keyed>
                              {(response) => (
                                <>
                                  <span>·</span>
                                  <span class={`font-bold ${getStatusTextColor(response.status)}`}>
                                    {response.status}
                                  </span>
                                  <span>·</span>
                                  <span>{Math.round(response.timing.duration)}ms</span>
                                </>
                              )}
                            </Show>
                          </div>
                          <Show when={entry.error}>
                            <p class="text-xs text-rose-500 dark:text-rose-400 mt-1 truncate">
                              {entry.error}
                            </p>
                          </Show>
                        </div>

                        {/* Actions */}
                        <div class="flex items-center gap-1 flex-shrink-0">
                          <Show when={props.onReplay}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                props.onReplay?.(entry);
                              }}
                              class="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              title={t('history.replay')}
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </button>
                          </Show>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              props.store.actions.removeEntry(entry.id);
                            }}
                            class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                            title={t('history.delete')}
                          >
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* Keyboard hints footer */}
        <Show when={props.store.state.entries.length > 0}>
          <div class="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
            <div class="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">↑↓</kbd>
                <span>{t('history.navigate')}</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">↵</kbd>
                <span>{t('history.replay')}</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">⌫</kbd>
                <span>{t('history.delete')}</span>
              </span>
            </div>
          </div>
        </Show>
      </div>
    </Drawer>
  );
};
