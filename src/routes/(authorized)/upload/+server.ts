import {
  isAllowedFileType,
  requestUpload,
  getFileUrl,
} from '$lib/server/bucket';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: { searchParams } }) => {
  const type = searchParams.get('type');
  if (!isAllowedFileType(type)) {
    throw error(406, `File type ${type} not accepted.`);
  }

  const { filename, url } = await requestUpload(type);
  const previewUrl = await getFileUrl(filename);

  return new Response(JSON.stringify({ filename, url, previewUrl }));
};
