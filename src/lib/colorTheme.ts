import { browser } from "$app/environment";
import { writable } from "svelte/store";

export enum ColorTheme {
    LIGHT = "light",
    DARK = "dark",
}

export const colorTheme = writable(ColorTheme.LIGHT);

export function toggleTheme() {
    colorTheme.update((value) => {
        if (value == ColorTheme.LIGHT) {
            return ColorTheme.DARK;
        } else {
            return ColorTheme.LIGHT;
        }
    });
}

if (browser) {
    const storedTheme = localStorage.getItem("theme") as ColorTheme ?? ColorTheme.LIGHT;
    colorTheme.set(storedTheme);
    colorTheme.subscribe((value) => {
        localStorage.setItem("theme", value);
    });
}