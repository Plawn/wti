export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps {
  /** Width of the skeleton (CSS value) */
  width?: string;
  /** Height of the skeleton (CSS value) */
  height?: string;
  /** Whether to apply rounded corners */
  rounded?: boolean;
  /** Skeleton shape variant */
  variant?: SkeletonVariant;
  /** Additional CSS classes */
  class?: string;
}
