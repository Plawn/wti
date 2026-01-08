export interface CodeBlockProps {
  /** The code to display */
  code: string;
  /** The programming language for syntax highlighting (default: 'json') */
  language?: string;
  /** Maximum height of the code block (default: '31.25rem') */
  maxHeight?: string;
  /** Whether to wrap long lines (default: false) */
  wrap?: boolean;
  /** Hide the copy button (default: false) */
  hideCopyButton?: boolean;
  /** Label for the copy button (default: 'Copy') */
  copyLabel?: string;
  /** Label shown after copying (default: 'Copied') */
  copiedLabel?: string;
  /** Additional CSS classes */
  class?: string;
}
