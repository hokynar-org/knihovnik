import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
  const hash = url.searchParams.get('hash')!;

  const _result = await db
    .update(users)
    .set({
      confirm_hash: null,
    })
    .where(eq(users.confirm_hash, hash));

  // TODO: branch this depending on updated rows count

  throw redirect(303, '/login');
}) satisfies RequestHandler;
