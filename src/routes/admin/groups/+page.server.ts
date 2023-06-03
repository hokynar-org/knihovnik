import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({locals, parent}) => { 
	await parent()
    if (!locals.user) {
		throw redirect(302, '/login')
	}
	else{
		if (locals.user.role!='ADMIN') {
			console.log(locals.user.role)
			throw redirect(302, '/')
		}
	}
}) satisfies PageServerLoad;