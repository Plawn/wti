import type { Component } from 'solid-js';
import { useI18n } from '../../i18n';

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"
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
      <input
        type="text"
        class="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 dark:bg-gray-800/80 border-0 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
        placeholder={t('common.search')}
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-200/60 dark:bg-gray-700/60 rounded">
          /
        </kbd>
      </div>
    </div>
  );
};
