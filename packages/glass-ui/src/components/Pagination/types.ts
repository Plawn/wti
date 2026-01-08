export interface PaginationProps {
  /** Total number of items */
  total: number;
  /** Current page (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Callback when page changes */
  onChange: (page: number) => void;
  /** Show page size selector */
  showPageSize?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Additional CSS classes */
  class?: string;
}
