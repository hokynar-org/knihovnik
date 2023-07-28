import type { Handle } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import type { Session } from "$lib/types";

export const handle: Handle = async ({ event, resolve }) => {
  const session_jwt = event.cookies.get("session_jwt");
  if (!session_jwt) {
    return await resolve(event);
  }
  try {
    const session = jwt.verify(session_jwt, JWT_SECRET) as Session;
    if(session.session_end>=Date.now()){
      event.locals.user=session.user_safe;
    }
  } catch (error) {
    return await resolve(event);
  }

  return await resolve(event);
};
