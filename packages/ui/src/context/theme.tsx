import {
  type Accessor,
  type JSX,
  type Setter,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import type { Theme } from '../App';

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
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage not available
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
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage not available
  }
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
