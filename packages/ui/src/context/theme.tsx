import {
  type Accessor,
  type JSX,
  type Setter,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import { getLocalStorageItem, setLocalStorageItem } from '../storage';
import type { Theme } from '../types';

const THEME_STORAGE_KEY = 'wti-theme';

interface ThemeContextValue {
  theme: Accessor<Theme>;
  setTheme: Setter<Theme>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

interface ThemeProviderProps {
  initialTheme?: Theme;
  children: JSX.Element;
}

function getStoredTheme(): Theme | null {
  const stored = getLocalStorageItem<Theme | null>(THEME_STORAGE_KEY, null);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

function getSystemTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

function persistTheme(theme: Theme): void {
  setLocalStorageItem(THEME_STORAGE_KEY, theme);
}

export function ThemeProvider(props: ThemeProviderProps) {
  // Initialize with stored theme, then system preference, then prop, then default to light
  const initialTheme = getStoredTheme() ?? props.initialTheme ?? getSystemTheme();
  const [theme, setThemeSignal] = createSignal<Theme>(initialTheme);

  const setTheme: Setter<Theme> = (value) => {
    const result = setThemeSignal(value);
    persistTheme(theme());
    return result;
  };

  const toggleTheme = () => {
    const newTheme = theme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Listen for system theme changes
  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!getStoredTheme()) {
        setThemeSignal(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
