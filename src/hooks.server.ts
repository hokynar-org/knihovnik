import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import type { Session } from '$lib/types';

export const handle: Handle = async ({ event, resolve }) => {
  const session_jwt = event.cookies.get('session_jwt');

  if (session_jwt) {
    try {
      const session = jwt.verify(session_jwt, JWT_SECRET) as Session;

      event.locals.user = session.user_safe;
    } catch (error) {
      // Remove the cookie if invalid
      event.cookies.delete('session_jwt');
    }
  }

  return await resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace(
        '%knihovnik.darkmode%',
        event.cookies.get('dark') === 'true' ? 'dark' : '',
      );
    },
  });
};
