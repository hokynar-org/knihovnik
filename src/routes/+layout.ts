import Cookies from 'js-cookie';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { prefersDarkMode } from '$lib/colorTheme';

export const load = async ({ data }) => {
  const darkMode = writable(data.darkMode ?? false);

  if (browser) {
    darkMode.subscribe((next) => {
      document.documentElement.classList.toggle('dark', next);
      Cookies.set('dark', String(next));
    });

    if (data.darkMode === null) darkMode.set(prefersDarkMode() ?? false);
  }

  return { ...data, darkMode };
};
