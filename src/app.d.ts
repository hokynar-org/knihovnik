// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrivateUserSafe } from '$lib/types';

declare global {
  namespace App {
    interface Locals {
      user: PrivateUserSafe;
    }
  }
}

export {};
