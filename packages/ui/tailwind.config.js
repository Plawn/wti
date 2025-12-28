/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // HTTP method colors
        method: {
          get: '#22c55e',
          post: '#3b82f6',
          put: '#f59e0b',
          patch: '#a855f7',
          delete: '#ef4444',
          head: '#06b6d4',
          options: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};
