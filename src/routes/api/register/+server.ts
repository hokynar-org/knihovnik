import { users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle';
import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";

export const GET = (async ({ url }) => {
    const register_jwt = url.searchParams.get('user');
    let jwt_user = ""
    try {
        jwt_user= jwt.verify(register_jwt, JWT_SECRET);
    } catch (error) {
        console.log(jwt_user)
        throw redirect(303,"/")
    }

    const user  = await db.select().from(users).where(eq(users.user_name, jwt_user.user_name));
    const email = await db.select().from(users).where(eq(users.email, jwt_user.email));

    if(user.length>0){
        throw redirect(303,"/")
    }

    if(email.length>0){
        throw redirect(303,"/")
    }

    try {
      await db.insert(users).values({
        user_name: jwt_user.user_name,
        full_name: jwt_user.full_name,
        email: jwt_user.email,
        pronouns: jwt_user.pronouns,
        password_hash: await bcrypt.hash(jwt_user.password, 10),
      });    
    } catch (error) {
        throw fail(500, {
				message: "Database Error",
			});
    }
    throw redirect(303,"/login")

}) satisfies RequestHandler;