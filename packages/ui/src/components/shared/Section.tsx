import type { Component, JSX } from 'solid-js';

export interface SectionProps {
  title: string;
  children: JSX.Element;
}

export const Section: Component<SectionProps> = (props) => (
  <div class="mt-4 md:mt-6 first:mt-1 first:md:mt-2">
    <h3 class="text-xs font-bold text-surface-700 dark:text-surface-400 uppercase tracking-wider mb-2 md:mb-3 px-1">
      {props.title}
    </h3>
    <div class="space-y-2 md:space-y-3">{props.children}</div>
  </div>
);
