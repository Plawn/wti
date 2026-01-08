export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Name for generating initials fallback */
  name: string;
  /** Avatar size */
  size?: AvatarSize;
  /** Custom fallback background color */
  fallbackColor?: string;
  /** Additional CSS classes */
  class?: string;
  /** Alt text for the image */
  alt?: string;
}
