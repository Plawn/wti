import type { Component } from 'solid-js';
import { useI18n } from '../../i18n';
import { Input } from '../shared';

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          class="w-[18px] h-[18px] text-gray-400 dark:text-gray-500"
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
      <Input
        value={props.value}
        onInput={props.onInput}
        placeholder={t('common.search')}
        class="pl-11 pr-10"
      />
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">/</span>
      </div>
    </div>
  );
};
