import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import tailwindAnimationDelay from 'tailwindcss-animation-delay';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('child', '&>*');
    }),
    tailwindAnimationDelay,
  ],
} satisfies Config;
