/**
 * WTI Web Component
 *
 * Usage in vanilla HTML:
 * ```html
 * <link rel="stylesheet" href="wti-element.css">
 * <script src="wti-element.iife.js"></script>
 * <wti-explorer spec-url="https://petstore.swagger.io/v2/swagger.json"></wti-explorer>
 * ```
 *
 * Attributes:
 * - spec-url: URL to the OpenAPI spec or gRPC endpoint
 * - spec-type: "openapi" (default) or "grpc"
 * - theme: "light" (default) or "dark"
 * - locale: "en" (default) or "fr"
 */
import './styles.css';
import { type Locale, type Theme, WTI } from '@wti/ui';
import { customElement } from 'solid-element';

interface WTIElementProps {
  'spec-url': string;
  'spec-type': 'openapi' | 'grpc';
  theme: Theme;
  locale: Locale;
}

customElement<WTIElementProps>(
  'wti-explorer',
  {
    'spec-url': '',
    'spec-type': 'openapi',
    theme: 'light',
    locale: 'en',
  },
  (props) => {
    const specInput = () => {
      if (!props['spec-url']) {
        return undefined;
      }
      if (props['spec-type'] === 'grpc') {
        return {
          type: 'grpc' as const,
          endpoint: props['spec-url'],
        };
      }
      return {
        type: 'openapi' as const,
        url: props['spec-url'],
      };
    };

    return WTI({
      spec: specInput(),
      theme: props.theme,
      locale: props.locale,
    });
  },
);

// Type declaration for global usage
declare global {
  interface HTMLElementTagNameMap {
    'wti-explorer': HTMLElement & WTIElementProps;
  }
}

// Export for programmatic usage
export type { WTIElementProps };
export { WTI, type Theme, type Locale } from '@wti/ui';
