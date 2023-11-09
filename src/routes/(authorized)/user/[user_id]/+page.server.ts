import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { error, fail, redirect } from '@sveltejs/kit';
import { borrow_requests, items, user_community_relations, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { and, eq, or } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { PageServerLoad, Actions } from './$types.js';
import type { Session } from '$lib/types.js';
import { notifications } from '$lib/store.js';
import { user_select } from '$lib/server/db/selects.js';

export const load = (async ({ locals, params }) => {
  if(!locals.user){
    throw redirect(301, '/login')
  }
  const this_user = locals.user;
  if(!params.user_id){
    throw error(400)
  }
  const user_id = params.user_id;

  const found_users = await db.select(user_select).from(users).where(eq(users.id, user_id));
  if(found_users.length==0){
    throw error(404);
  }

  const user = found_users[0];

  const user_communities = await Promise.all([
    db.select().from(user_community_relations).where(and(eq(user_community_relations.user_id,user.id),or(eq(user_community_relations.role,'ADMIN'),eq(user_community_relations.role,'MEMBER')))),
    db.select().from(user_community_relations).where(and(eq(user_community_relations.user_id,this_user.id),or(eq(user_community_relations.role,'ADMIN'),eq(user_community_relations.role,'MEMBER')))),
  ]);

  const this_user_relations = user_communities[0];
  const user_relations = user_communities[1];
  const shared_communities = this_user_relations.filter((value)=>{
      if(user_relations.filter((fvalue)=>{
        if(value.community_id==fvalue.community_id){
          return true
        }
        else{
          return false
        }
      }).length){
        return true
      }
      else{
        return false
      }
    }
  )
  if(shared_communities.length==0){
    return {
    profiled_user:{
      id:user.id,
      user_name:user.user_name,
      full_name:null,
      pronouns: null,
      bio: null,
    }
    }
  }
  else{
    return {profiled_user:user}
  }
  
}) satisfies PageServerLoad;