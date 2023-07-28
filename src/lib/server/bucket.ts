import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import {
  BUCKET_ENDPOINT,
  BUCKET_NAME,
  BUCKET_ACCESS_KEY_ID,
  BUCKET_SECRET_ACCESS_KEY,
} from '$env/static/private';

const S3 = new S3Client({
  region: 'auto',
  endpoint: BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY_ID,
    secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
  },
});

export async function getFileUrl(filename: string) {
  return await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename }),
    {
      expiresIn: 3600,
    },
  );
}

export async function uploadFile(stream: ReadableStream<Uint8Array>) {
  new PutObjectCommand({ Bucket: BUCKET_NAME, Key: undefined, Body: stream });
}

const allowedFileTypes = new Set(<const>[
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
]);
export type FileFormat = typeof allowedFileTypes extends Set<infer T>
  ? T
  : never;
export const isAllowedFileType = (mime: string): mime is FileFormat =>
  allowedFileTypes.has(mime as any);

export async function requestUpload(format: FileFormat): Promise<{
  filename: string;
  url: string;
}> {
  if (!isAllowedFileType(format)) {
    throw new TypeError(`Forbidden file format: ${format}`);
  }
  const filename = uuid();

  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({ Bucket: BUCKET_NAME, Key: filename }),
    {
      expiresIn: 3600,
    },
  );

  return { filename, url };
}
