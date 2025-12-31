import { type Component, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useI18n } from '../../i18n';

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  const { t } = useI18n();
  let inputRef: HTMLInputElement | undefined;
  const [isFocused, setIsFocused] = createSignal(false);

  // Handle global keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K or /
    if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k') || e.key === '/') {
      // Don't capture / if we're already typing in an input
      if (
        e.key === '/' &&
        (document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      e.preventDefault();
      inputRef?.focus();
    }
    // Escape to blur
    if (e.key === 'Escape' && document.activeElement === inputRef) {
      inputRef?.blur();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  });

  const handleClear = () => {
    props.onInput('');
    inputRef?.focus();
  };

  return (
    <div class="relative group">
      {/* Search Icon */}
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
        <svg
          class={`w-[1.125rem] h-[1.125rem] ${
            isFocused()
              ? 'text-accent-500 dark:text-accent-400'
              : 'text-surface-600 dark:text-surface-500'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        class={`w-full px-3 py-2 sm:py-2.5 glass-input text-base sm:text-sm text-surface-950 dark:text-surface-100 placeholder-surface-700 dark:placeholder-surface-500 font-medium outline-none transition-all duration-200 ${
          isFocused() ? 'shadow-lg shadow-accent-500/10' : ''
        }`}
        style="padding-left: 44px !important; padding-right: 40px !important;"
        placeholder={t('common.search')}
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Right side: Shortcut hint or Clear button */}
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Show
          when={props.value}
          fallback={
            <div
              class={`flex items-center gap-1 transition-opacity duration-200 ${
                isFocused() ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
              }`}
            >
              <kbd class="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[0.625rem] font-sans font-bold text-surface-700 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700">
                /
              </kbd>
            </div>
          }
        >
          <button
            type="button"
            onClick={handleClear}
            class="p-1 rounded-md text-surface-600 hover:text-surface-800 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40"
            aria-label="Clear search"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Show>
      </div>
    </div>
  );
};
