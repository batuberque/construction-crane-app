/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        graphite: '#14161A',
        steel: { DEFAULT: '#22262E', line: '#2E333C' },
        concrete: '#A8A29A',
        signal: '#F4F3F0',
        hazard: '#F5C518',
        // Surface-aware aliases: resolve against whatever [data-surface] is set.
        surface: 'var(--bg)',
        raised: 'var(--raised)',
        line: 'var(--line)',
        fg: { DEFAULT: 'var(--fg)', muted: 'var(--fg-muted)' },
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid scale — replaces the old text-4xl md:text-6xl step jumps.
        'display-xl': ['clamp(2.75rem, 1.4rem + 5.2vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-l': ['clamp(1.875rem, 1.2rem + 2.4vw, 3.25rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-m': ['clamp(1.25rem, 1.05rem + 0.85vw, 1.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body-l': ['clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)', { lineHeight: '1.6' }],
      },
      maxWidth: {
        prose: '68ch',
      },
      spacing: {
        nav: 'var(--nav-h)',
      },
    },
  },
  plugins: [],
};
