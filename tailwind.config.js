/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        phosphor: '0 0 22px rgba(92, 255, 191, 0.08)',
        panel: '0 18px 60px rgba(0, 0, 0, 0.28)'
      }
    }
  },
  plugins: []
};
