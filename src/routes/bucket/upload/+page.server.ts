import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
    request.body;
};
