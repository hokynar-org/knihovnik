import { db } from '$lib/server/db/drizzle';
import { communities, community_messages, item_visibility, user_community_relations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

export const load = (async ({ locals,params }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user=locals.user;
  if(!params.community_id){
    throw error(400);
  }
  const community_id=Number(params.community_id)
  const user_relations = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id,community_id),eq(user_community_relations.user_id,user.id)));
  if(user_relations.length==0){
    throw error(401);
  }
  const user_relation=user_relations[0];
  if(user_relation.role!='ADMIN'){
    throw error(403);
  }
  return {
    community_form: superValidate(community_form_schema),
  }; 
}) satisfies PageServerLoad;

export const actions: Actions = {
  edit_community: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    const user = locals.user;

    if(!Number(params.community_id)){
      throw error(400);
    }
    const community_id=Number(params.community_id);

    const form = await superValidate(request, community_form_schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const relation = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user.id)));
    if(relation.length==0){
      return fail(403, { form });
    }
    if(relation[0].role!='ADMIN'){
      return fail(403, { form });
    }
    try {
      const [community] = (await db.update(communities).set({
        name: form.data.name as string,
        description: form.data.description as string,
        visibility: form.data.visibility,
      }).where(eq(communities.id,community_id)).returning());
    } catch (error) {
      return fail(500, { message: 'Internal Error' });
    }
    throw redirect(301, '/community/'+community_id);
  },
  delete_community: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    const user = locals.user;

    if(!Number(params.community_id)){
      throw error(400);
    }
    const community_id=Number(params.community_id);

    const form = await superValidate(request, community_form_schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const relation = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user.id)));
    if(relation.length==0){
      return fail(403, { form });
    }
    if(relation[0].role!='ADMIN'){
      return fail(403, { form });
    }
    try {
      await db.transaction(async (tx)=>{
        const [visibility] = (await tx.delete(item_visibility).where(eq(item_visibility.community_id,community_id)).returning())
        const [relations] = (await tx.delete(user_community_relations).where(eq(user_community_relations.community_id,community_id)).returning())
        const [community_message] = (await tx.delete(community_messages).where(eq(community_messages.community_id,community_id)).returning());
        const [community] = (await tx.delete(communities).where(eq(communities.id,community_id)).returning());
      })
    } catch (error) {
      return fail(500, { message: 'Internal Error' });
    }
    throw redirect(301, '/community');
  },
}

const community_form_schema = z.object({
  name: z.string().min(2),
  description: z.string().min(0).nullable(),
  visibility: z.boolean().default(false),
});