import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

if (!process.env.SUPABASE_ACCESS_KEY_ID || !process.env.SUPABASE_SECRET_ACCESS_KEY) {
  throw new Error("Supabase S3 credentials are not configured properly")
}

if (!process.env.SUPABASE_BUCKET_NAME) {
  throw new Error("SUPABASE_BUCKET_NAME environment variable is not set")
}

// Initialize S3 client for Supabase Storage
export const s3Client = new S3Client({
  region: "ap-northeast-2",
  endpoint: "https://prghanvqbigabvgfgqpn.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for Supabase
})

export const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME

/**
 * Upload a file to Supabase Storage
 * @param file File buffer
 * @param key S3 key (path) for the file
 * @param contentType MIME type of the file
 * @returns Supabase Storage URL of the uploaded file
 */
export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)

  // Return the public URL for Supabase Storage
  return `https://prghanvqbigabvgfgqpn.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${key}`
}

/**
 * Delete a file from Supabase Storage
 * @param key S3 key (path) of the file to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Generate a presigned URL for direct browser upload to Supabase Storage
 * @param key S3 key (path) for the file
 * @param contentType MIME type of the file
 * @param expiresIn Expiration time in seconds (default: 5 minutes)
 * @returns Presigned URL
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Extract S3 key from a full Supabase Storage URL
 * @param url Full Supabase Storage URL
 * @returns S3 key
 */
export function extractS3Key(url: string): string {
  try {
    const urlObj = new URL(url)
    // Extract key from Supabase URL format: /storage/v1/object/public/{bucket}/{key}
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    if (match) {
      return match[1]
    }
    // Remove leading slash
    return urlObj.pathname.substring(1)
  } catch {
    // If it's not a full URL, assume it's already a key
    return url
  }
}
