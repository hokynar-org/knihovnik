import { getFileUrl } from '$lib/server/bucket';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    return {
        rocksand: await getFileUrl('rocksand.mp4'),
    };
};
