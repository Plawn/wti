import { marked } from 'marked';
import { type Component, Show, createMemo } from 'solid-js';

export interface MarkdownProps {
  content: string | undefined;
  class?: string;
}

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

export const Markdown: Component<MarkdownProps> = (props) => {
  const html = createMemo(() => {
    if (!props.content) return '';
    try {
      return marked.parse(props.content, { async: false }) as string;
    } catch {
      return props.content;
    }
  });

  return (
    <Show when={props.content}>
      <div
        class={`markdown-content prose prose-sm max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-headings:font-semibold prose-headings:leading-tight
          prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-3
          prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
          prose-p:text-gray-600 dark:prose-p:text-gray-400
          prose-p:leading-relaxed prose-p:my-2
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-800 dark:prose-strong:text-gray-200
          prose-strong:font-semibold
          prose-code:text-sm prose-code:font-mono
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-code:text-gray-800 dark:prose-code:text-gray-200
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
          prose-pre:text-gray-100 prose-pre:rounded-xl
          prose-pre:p-4 prose-pre:my-3 prose-pre:overflow-x-auto
          prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
          prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal
          prose-li:text-gray-600 dark:prose-li:text-gray-400
          prose-li:my-0.5
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300
          dark:prose-blockquote:border-gray-600
          prose-blockquote:pl-4 prose-blockquote:my-3
          prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-blockquote:italic
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700
          prose-hr:my-4
          prose-table:my-3
          prose-th:text-left prose-th:text-gray-800 dark:prose-th:text-gray-200
          prose-th:font-semibold prose-th:p-2
          prose-th:border-b prose-th:border-gray-200 dark:prose-th:border-gray-700
          prose-td:p-2 prose-td:text-gray-600 dark:prose-td:text-gray-400
          prose-td:border-b prose-td:border-gray-100 dark:prose-td:border-gray-800
          ${props.class ?? ''}`}
        innerHTML={html()}
      />
    </Show>
  );
};
