/**
 * Code Snippets Panel
 *
 * Displays generated code snippets in multiple languages
 */

import type { RequestConfig } from '@wti/core';
import { type Component, For, Show, createMemo, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import { CodeBlock } from '../shared';

type CodeLanguage = 'curl' | 'javascript' | 'python' | 'go';

interface GeneratedCode {
  language: CodeLanguage;
  displayName: string;
  code: string;
}

const LANGUAGES: Array<{ language: CodeLanguage; displayName: string }> = [
  { language: 'curl', displayName: 'cURL' },
  { language: 'javascript', displayName: 'JavaScript' },
  { language: 'python', displayName: 'Python' },
  { language: 'go', displayName: 'Go' },
];

interface CodeSnippetsProps {
  request: RequestConfig;
}

/**
 * Generate code for a specific language
 */
function generateCodeForLanguage(language: CodeLanguage, request: RequestConfig): string {
  switch (language) {
    case 'curl':
      return generateCurl(request);
    case 'javascript':
      return generateJavaScript(request);
    case 'python':
      return generatePython(request);
    case 'go':
      return generateGo(request);
    default:
      return '// Unsupported language';
  }
}

function generateCurl(req: RequestConfig): string {
  const lines: string[] = ['curl'];
  if (req.method !== 'GET') {
    lines.push(`  -X ${req.method} \\`);
  }
  if (req.headers) {
    for (const [key, value] of Object.entries(req.headers)) {
      lines.push(`  -H '${key}: ${value}' \\`);
    }
  }
  if (req.body) {
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body, null, 2);
    lines.push(`  -d '${bodyStr.replace(/'/g, "\\'")}' \\`);
  }
  let url = req.url;
  if (req.params && Object.keys(req.params).length > 0) {
    const params = new URLSearchParams(req.params).toString();
    url += (url.includes('?') ? '&' : '?') + params;
  }
  lines.push(`  '${url}'`);
  return lines.join('\n');
}

function generateJavaScript(req: RequestConfig): string {
  const options: string[] = [`  method: '${req.method}',`];
  if (req.headers && Object.keys(req.headers).length > 0) {
    options.push(`  headers: ${JSON.stringify(req.headers, null, 4).replace(/\n/g, '\n  ')},`);
  }
  if (req.body) {
    options.push(`  body: JSON.stringify(${JSON.stringify(req.body, null, 4).replace(/\n/g, '\n  ')}),`);
  }
  let url = req.url;
  if (req.params && Object.keys(req.params).length > 0) {
    const params = new URLSearchParams(req.params).toString();
    url += (url.includes('?') ? '&' : '?') + params;
  }
  return `fetch('${url}', {
${options.join('\n')}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
}

function generatePython(req: RequestConfig): string {
  const lines: string[] = ['import requests', ''];
  let url = req.url;
  if (req.params && Object.keys(req.params).length > 0) {
    const params = new URLSearchParams(req.params).toString();
    url += (url.includes('?') ? '&' : '?') + params;
  }
  lines.push(`url = "${url}"`);
  if (req.headers && Object.keys(req.headers).length > 0) {
    lines.push(`headers = ${JSON.stringify(req.headers, null, 4)}`);
  }
  if (req.body) {
    lines.push(`payload = ${JSON.stringify(req.body, null, 4)}`);
  }
  lines.push('');
  const args = ['url'];
  if (req.headers && Object.keys(req.headers).length > 0) args.push('headers=headers');
  if (req.body) args.push('json=payload');
  lines.push(`response = requests.${req.method.toLowerCase()}(${args.join(', ')})`);
  lines.push('print(response.json())');
  return lines.join('\n');
}

function generateGo(req: RequestConfig): string {
  let url = req.url;
  if (req.params && Object.keys(req.params).length > 0) {
    const params = new URLSearchParams(req.params).toString();
    url += (url.includes('?') ? '&' : '?') + params;
  }
  const hasBody = req.body !== undefined;
  return `package main

import (
	"fmt"
	"io"
	"net/http"${hasBody ? '\n\t"bytes"' : ''}
)

func main() {
	${hasBody ? `body := []byte(\`${JSON.stringify(req.body, null, 2)}\`)\n\treq, _ := http.NewRequest("${req.method}", "${url}", bytes.NewBuffer(body))` : `req, _ := http.NewRequest("${req.method}", "${url}", nil)`}
${req.headers ? Object.entries(req.headers).map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`).join('\n') : ''}
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
}

export const CodeSnippets: Component<CodeSnippetsProps> = (props) => {
  const { t } = useI18n();
  const [selectedLang, setSelectedLang] = createSignal<CodeLanguage>('curl');
  const [copied, setCopied] = createSignal(false);

  const generatedCode = createMemo((): GeneratedCode | null => {
    try {
      const lang = selectedLang();
      const langInfo = LANGUAGES.find((l) => l.language === lang);
      return {
        language: lang,
        displayName: langInfo?.displayName || lang,
        code: generateCodeForLanguage(lang, props.request),
      };
    } catch {
      return null;
    }
  });

  const copyToClipboard = async () => {
    const code = generatedCode();
    if (code) {
      try {
        await navigator.clipboard.writeText(code.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const languageToHighlight = (lang: CodeLanguage): string => {
    switch (lang) {
      case 'curl':
        return 'bash';
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'go':
        return 'go';
      default:
        return 'plaintext';
    }
  };

  return (
    <div class="glass-card rounded-2xl overflow-hidden">
      {/* Header with language tabs */}
      <div class="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
          <For each={LANGUAGES}>
            {(lang) => (
              <button
                type="button"
                onClick={() => setSelectedLang(lang.language)}
                class={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedLang() === lang.language
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {lang.displayName}
              </button>
            )}
          </For>
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={copyToClipboard}
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-button rounded-lg transition-all"
        >
          <Show
            when={copied()}
            fallback={
              <>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t('common.copy')}
              </>
            }
          >
            <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {t('common.copied')}
          </Show>
        </button>
      </div>

      {/* Code content */}
      <div class="max-h-96 overflow-auto">
        <Show when={generatedCode()} fallback={<div class="p-4 text-gray-500">Failed to generate code</div>}>
          {(code) => (
            <CodeBlock
              code={code().code}
              language={languageToHighlight(code().language)}
              hideCopyButton
            />
          )}
        </Show>
      </div>
    </div>
  );
};
