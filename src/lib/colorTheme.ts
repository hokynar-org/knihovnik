import { browser } from "$app/environment";
import { writable } from "svelte/store";

export enum ColorTheme {
  Light = "light",
  Dark = "dark",
}

function preferredColorTheme() {
  if (matchMedia("(prefers-color-scheme: light)").matches) {
    return ColorTheme.Light;
  }
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    return ColorTheme.Dark;
  }
}

export const colorTheme = writable(ColorTheme.Light);

export function toggleTheme() {
  colorTheme.update((value) => {
    if (value == ColorTheme.Light) {
      return ColorTheme.Dark;
    } else {
      return ColorTheme.Light;
    }
  });
}

interface SetCookie {
  name: string;
  value: string;
  expires: number;
  domain: string;
}

interface Cookie extends SetCookie {
  partitioned: boolean;
  path: string;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
}

declare const cookieStore: {
  delete(name: string): Promise<void>;
  delete(options: {
    name: string;
    partitioned?: boolean;
    path?: string;
    url?: string;
  }): Promise<void>;

  get(name: string): Promise<Cookie | undefined>;
  get(options: { name: string; url: string }): Promise<Cookie | undefined>;

  getAll(): Promise<Cookie[]>;
  getAll(name: string): Promise<Cookie[]>;
  getAll(options: { name: string; url: string }): Promise<Cookie[]>;

  set(name: string, value: string): Promise<void>;
  set(options: SetCookie): Promise<void>;
};

if (browser) {
  (async () => {
    const storedTheme =
      ((await cookieStore.get("theme"))?.value as ColorTheme) ??
      preferredColorTheme() ??
      ColorTheme.Light;

    colorTheme.set(storedTheme);
    colorTheme.subscribe(async (value) => {
      await cookieStore.set("theme", value);
    });
  })();
}
