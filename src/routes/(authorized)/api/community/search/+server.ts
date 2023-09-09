
import { db } from "$lib/server/db/drizzle";
import { communities } from "$lib/server/db/schema";
import { error, type RequestHandler } from "@sveltejs/kit";
import { and, eq, ilike } from "drizzle-orm";


export const GET:RequestHandler=(async ({url}) => {
    let search_name = url.searchParams.get('search_name') as string;

    if(search_name.length<2){
        throw error(400)
    }

    const public_communities = await db.select().from(communities).where(and(eq(communities.visibility,true),ilike(communities.name,'%'+search_name+'%')))

    if(public_communities.length==0){
        throw error(404)
    }

    return new Response(JSON.stringify(public_communities),{status:200});
}) satisfies RequestHandler;