import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        foreground: '#EDEDED',
        gold: '#C8A04B',
        graphite: '#1E1E1E',
        grayMedium: '#B0B0B0',
      },
      fontFamily: {
        sans: 'var(--font-work-sans), sans-serif',
        serif: 'var(--font-merriweather), serif',
      },
    },
  },
  plugins: [],
} satisfies Config;
