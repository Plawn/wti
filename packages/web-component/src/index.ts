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
