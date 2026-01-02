import type { Locale, Theme } from '../../ui/src/index.tsx';
interface WTIElementProps {
  'spec-url': string;
  'spec-type': 'openapi' | 'grpc';
  theme: Theme;
  locale: Locale;
}
declare global {
  interface HTMLElementTagNameMap {
    'wti-element': HTMLElement & WTIElementProps;
  }
}
export type { WTIElementProps };
export { WTI, type Theme, type Locale } from '../../ui/src/index.tsx';
//# sourceMappingURL=index.d.ts.map
