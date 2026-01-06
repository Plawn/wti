import { type Component, Show, createSignal } from 'solid-js';
import { parse as parseYaml } from 'yaml';
import { useI18n } from '../i18n';
import type { SpecStore } from '../stores';
import { Button, Input } from './shared';

interface SpecLoaderProps {
  store: SpecStore;
}

type SpecType = 'openapi' | 'grpc';

export const SpecLoader: Component<SpecLoaderProps> = (props) => {
  const { t } = useI18n();
  const [url, setUrl] = createSignal('');
  const [specType, setSpecType] = createSignal<SpecType>('openapi');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isDragging, setIsDragging] = createSignal(false);

  let fileInputRef: HTMLInputElement | undefined;

  const handleLoadFromUrl = async () => {
    const specUrl = url().trim();
    if (!specUrl) {
      setError(t('specLoader.urlRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (specType() === 'grpc') {
        await props.store.actions.loadSpec({ type: 'grpc', endpoint: specUrl });
      } else {
        await props.store.actions.loadSpec({ type: 'openapi', url: specUrl });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('specLoader.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['application/json', 'application/x-yaml', 'text/yaml', 'text/plain'];
    const validExtensions = ['.json', '.yaml', '.yml'];
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError(t('specLoader.invalidFileType'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const trimmed = content.trim();
      let spec: unknown;

      // Try JSON first if it looks like JSON
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          spec = JSON.parse(content);
        } catch {
          // Fall through to YAML
          spec = parseYaml(content);
        }
      } else {
        // Parse as YAML (also handles JSON)
        spec = parseYaml(content);
      }

      await props.store.actions.loadSpec({ type: 'openapi', spec });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('specLoader.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: Event) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const file = target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    target.value = '';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadFromUrl();
    }
  };

  const placeholder = () =>
    specType() === 'grpc'
      ? t('specLoader.grpcPlaceholder')
      : 'https://api.example.com/openapi.json';

  return (
    <div class="flex flex-col items-center justify-center min-h-screen p-8">
      <div class="glass-card rounded-4xl p-10 max-w-lg w-full">
        {/* Logo */}
        <div class="flex flex-col items-center mb-8">
          <div class="relative inline-flex mb-6">
            <div class="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25">
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="absolute -inset-2 rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-15 blur-2xl -z-10" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">WTI</h1>
          <p class="text-gray-500 dark:text-gray-400">{t('specLoader.subtitle')}</p>
        </div>

        <div class="divider-glass my-6" />

        {/* URL Input Section */}
        <div class="space-y-4">
          <div>
            <label
              for="spec-url"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t('specLoader.loadFromUrl')}
            </label>

            {/* Type selector */}
            <div class="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSpecType('openapi')}
                class={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  specType() === 'openapi'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('specLoader.openapi')}
              </button>
              <button
                type="button"
                onClick={() => setSpecType('grpc')}
                class={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  specType() === 'grpc'
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('specLoader.grpc')}
              </button>
            </div>

            <div class="flex gap-2">
              <Input
                id="spec-url"
                value={url()}
                onInput={setUrl}
                onKeyDown={handleKeyDown}
                placeholder={placeholder()}
                class="flex-1"
              />
              <Button onClick={handleLoadFromUrl} disabled={isLoading()}>
                {isLoading() ? t('specLoader.loading') : t('specLoader.load')}
              </Button>
            </div>
          </div>

          {/* File upload only for OpenAPI */}
          <Show when={specType() === 'openapi'}>
            {/* Divider with "or" */}
            <div class="flex items-center gap-4 my-6">
              <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span class="text-sm text-gray-400 dark:text-gray-500">{t('specLoader.or')}</span>
              <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* File Upload Section */}
            <div>
              <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('specLoader.uploadFile')}
              </span>
              <label
                class={`relative rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden group border-2 block ${
                  isDragging()
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.02] shadow-xl shadow-blue-500/20'
                    : 'border-dashed border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-white/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.yaml,.yml"
                  class="sr-only"
                  onChange={handleFileInputChange}
                />
                <div class="flex flex-col items-center gap-4 relative z-10">
                  <div
                    class={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging()
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-700 shadow-sm'
                    }`}
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-200">
                      <span class="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        {t('specLoader.clickToUpload')}
                      </span>{' '}
                      {t('specLoader.orDragDrop')}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t('specLoader.supportedFormats')}
                    </p>
                  </div>
                </div>

                {/* Background accent for glass effect */}
                <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
              </label>
            </div>
          </Show>
        </div>

        {/* Error Display */}
        <Show when={error()}>
          <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
            <p class="text-sm text-red-600 dark:text-red-400">{error()}</p>
          </div>
        </Show>

        {/* Example specs - only for OpenAPI */}
        <Show when={specType() === 'openapi'}>
          <div class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">
              {t('specLoader.tryExample')}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="px-3 py-1.5 text-xs rounded-lg glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setUrl('https://petstore3.swagger.io/api/v3/openapi.json')}
              >
                Petstore API
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs rounded-lg glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setUrl('https://api.apis.guru/v2/openapi.yaml')}
              >
                APIs.guru
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
