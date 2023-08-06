import { join } from 'path';
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(
      require.resolve('@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}',
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), ...skeleton()],
};
