import { isAllowedFileType } from '$lib/server/bucket';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const type = url.searchParams.get('type');
    if (!isAllowedFileType(type ?? '')) return new Response();
    return new Response();
};
