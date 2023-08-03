import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const port = process.env.VITE_PORT;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: port ? parseInt(port) : undefined,
  },
});
