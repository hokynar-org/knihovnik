/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        foreground: `rgb(var(--color-foreground) / <alpha-value>)`,
        background: `rgb(var(--color-background) / <alpha-value>)`,
        surface: `rgb(var(--color-surface) / <alpha-value>)`,
        primary: `rgb(var(--color-primary) / <alpha-value>)`,
        secondary: `rgb(var(--color-secondary) / <alpha-value>)`,
        accent: `rgb(var(--color-accent) / <alpha-value>)`,
        muted: `rgb(var(--color-muted) / <alpha-value>)`,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
