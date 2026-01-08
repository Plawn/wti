import type { JSX } from 'solid-js';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  /** Unique key for the column, used to access data */
  key: string;
  /** Column header label */
  header: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (value: unknown, row: T, index: number) => JSX.Element;
  /** Column width (CSS value) */
  width?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export interface SortState {
  /** Column key being sorted */
  column: string | null;
  /** Sort direction */
  direction: SortDirection;
}

export interface TableProps<T> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Data rows */
  data: T[];
  /** Enable sorting functionality */
  sortable?: boolean;
  /** Current sort state (controlled) */
  sort?: SortState;
  /** Callback when sort changes */
  onSort?: (sort: SortState) => void;
  /** Message to display when data is empty */
  emptyMessage?: string;
  /** Additional CSS classes */
  class?: string;
  /** Row key accessor function */
  getRowKey?: (row: T, index: number) => string | number;
}
