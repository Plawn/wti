import { type Locale, type SpecInput, type Theme, WTI } from '@wti/ui';
import { For, createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import './styles.css';

// Example API specs for demonstration
const EXAMPLE_SPECS: Array<{ name: string; spec: SpecInput }> = [
  {
    name: 'Petstore v3',
    spec: { type: 'openapi', url: 'https://petstore3.swagger.io/api/v3/openapi.json' },
  },
  {
    name: 'GitHub API',
    spec: {
      type: 'openapi',
      url: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
    },
  },
  {
    name: 'Stripe API',
    spec: {
      type: 'openapi',
      url: 'https://raw.githubusercontent.com/APIs-guru/openapi-directory/main/APIs/stripe.com/2022-11-15/openapi.yaml',
    },
  },
];

function App() {
  const [theme, setTheme] = createSignal<Theme>('dark');
  const [locale, setLocale] = createSignal<Locale>('en');
  const [selectedSpec, setSelectedSpec] = createSignal<SpecInput | undefined>(undefined);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  return (
    <div class="relative min-h-screen">
      {/* Control Panel */}
      <div class="fixed top-4 right-4 z-50 flex items-center gap-2 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        {/* Spec Selector */}
        <select
          class="px-3 py-2 text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          onChange={(e) => {
            const idx = parseInt(e.currentTarget.value, 10);
            setSelectedSpec(idx >= 0 ? EXAMPLE_SPECS[idx].spec : undefined);
          }}
        >
          <option value="-1">Select API...</option>
          <For each={EXAMPLE_SPECS}>
            {(spec, i) => <option value={i()}>{spec.name}</option>}
          </For>
        </select>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle theme"
        >
          {theme() === 'dark' ? (
            <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Locale Toggle */}
        <button
          type="button"
          onClick={toggleLocale}
          class="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Toggle language"
        >
          {locale().toUpperCase()}
        </button>
      </div>

      {/* WTI Component */}
      <WTI theme={theme()} locale={locale()} spec={selectedSpec()} />
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

render(() => <App />, root);
