import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

let s3ClientInstance: S3Client | null = null

function getS3Client(): S3Client | null {
  if (s3ClientInstance) return s3ClientInstance

  const endpoint = process.env.AWS_ENDPOINT_URL_S3
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION || "us-east-2"

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null
  }

  s3ClientInstance = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  })

  return s3ClientInstance
}

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.AWS_ENDPOINT_URL_S3 &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.RESUMES_BUCKET
  )
}

/**
 * Uploads a resume to S3-compatible object storage.
 * Accepts Base64 data URI or raw Buffer.
 * Returns the object storage URI (s3://bucket/key).
 */
export async function uploadResumeToObjectStorage(
  dataUriOrBuffer: string | Buffer,
  options: { employeeId: string; filename?: string; mimeType?: string }
): Promise<string> {
  const s3 = getS3Client()
  const bucket = process.env.RESUMES_BUCKET || "resume-venturelens-01"

  if (!s3) {
    // Fall back to returning string as-is if storage is not configured
    if (typeof dataUriOrBuffer === "string") return dataUriOrBuffer
    throw new Error("Object storage credentials are not configured.")
  }

  let buffer: Buffer
  let contentType = options.mimeType || "application/pdf"
  let ext = "pdf"

  if (typeof dataUriOrBuffer === "string") {
    // If it's already an external URL, just return it
    if (/^https?:\/\//i.test(dataUriOrBuffer)) {
      return dataUriOrBuffer
    }

    const matches = dataUriOrBuffer.match(/^data:([a-zA-Z0-9_\-\.\/]+);base64,(.+)$/)
    if (matches) {
      contentType = matches[1]
      buffer = Buffer.from(matches[2], "base64")
      if (contentType.includes("pdf")) ext = "pdf"
      else if (contentType.includes("word") || contentType.includes("officedocument")) ext = "docx"
      else if (contentType.includes("msword")) ext = "doc"
      else if (contentType.includes("plain")) ext = "txt"
    } else {
      buffer = Buffer.from(dataUriOrBuffer, "base64")
    }
  } else {
    buffer = dataUriOrBuffer
  }

  const safeName = options.filename ? options.filename.replace(/[^a-zA-Z0-9.\-_]/g, "_") : `resume.${ext}`
  const key = `resumes/${options.employeeId}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeName}`

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return `s3://${bucket}/${key}`
}

/**
 * Resolves a stored resume_url to an accessible URL.
 * If it is an s3:// URI or S3 key, generates a presigned GET URL (1 hour expiry).
 * If it is already a Base64 string or normal http/https URL, returns it unchanged.
 */
export async function resolveResumeUrl(storedUrl?: string | null): Promise<string | null> {
  if (!storedUrl) return null

  // If Base64 data URI, return as-is for backward compatibility
  if (storedUrl.startsWith("data:")) {
    return storedUrl
  }

  const s3 = getS3Client()
  if (!s3) return storedUrl

  let bucket = process.env.RESUMES_BUCKET || "resume-venturelens-01"
  let key = storedUrl

  if (storedUrl.startsWith("s3://")) {
    const parts = storedUrl.slice(5).split("/")
    bucket = parts[0]
    key = parts.slice(1).join("/")
  } else if (!storedUrl.startsWith("resumes/") && /^https?:\/\//i.test(storedUrl)) {
    // Normal external HTTP link, return directly
    return storedUrl
  }

  try {
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn: 3600 } // 1 hour
    )
    return signedUrl
  } catch (err) {
    console.error("[resolveResumeUrl] Failed to generate presigned URL:", err)
    return storedUrl
  }
}
