import { isAllowedFileType, requestUpload } from '$lib/server/bucket';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const type = url.searchParams.get('type');
  if (!isAllowedFileType(type)) {
    throw error(406, `File type ${type} not accepted.`);
  }

  return new Response(JSON.stringify(await requestUpload(type)));
};
