// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrivateUserSafe } from "$lib/types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

declare global {
  namespace App {
    interface Locals {
      user:PrivateUserSafe;
    }
  }
  var db: PostgresJsDatabase;
}

export {};
