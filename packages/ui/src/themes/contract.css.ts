import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  colors: {
    bg: null,
    bgSecondary: null,
    bgTertiary: null,
    text: null,
    textMuted: null,
    textInverse: null,
    border: null,
    borderHover: null,
    primary: null,
    primaryHover: null,
    // HTTP methods
    get: null,
    post: null,
    put: null,
    patch: null,
    delete: null,
    // Status
    success: null,
    warning: null,
    error: null,
    info: null,
  },
  fonts: {
    sans: null,
    mono: null,
  },
  fontSizes: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
  },
  fontWeights: {
    normal: null,
    medium: null,
    semibold: null,
    bold: null,
  },
  spacing: {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null,
    '5': null,
    '6': null,
    '8': null,
    '10': null,
    '12': null,
    '16': null,
  },
  radii: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    full: null,
  },
  shadows: {
    sm: null,
    md: null,
    lg: null,
  },
  transitions: {
    fast: null,
    normal: null,
  },
});
