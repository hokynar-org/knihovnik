export function prefersDarkMode() {
  if (matchMedia('(prefers-color-scheme: dark)').matches) return true;
  if (matchMedia('(prefers-color-scheme: light)').matches) return false;

  // For explicity
  return null;
}
