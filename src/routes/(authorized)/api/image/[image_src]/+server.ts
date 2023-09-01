import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getFileUrl } from "$lib/server/bucket";

export const GET = (async ({locals, params}) => {
    if (!locals.user) {
        throw error(401);
    }
    if (!params.image_src) {
        throw error(400);
    }
    const image_src=params.image_src;
    return(json({image_url:await getFileUrl(image_src)}))

}) satisfies RequestHandler;