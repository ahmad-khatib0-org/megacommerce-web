import { Meta, UppyFile } from '@uppy/core'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'

export function buildAttachment(file: UppyFile<Meta, Record<string, never>>): Promise<Attachment> {
  return new Promise((res) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.data as Blob)
    reader.onload = () => {
      const attachment: Attachment = {
        id: file.id,
        filename: file.name ?? '',
        fileType: file.type,
        fileSize: file.size?.toString() ?? '',
        fileExtension: file.extension,
        base64: reader.result as string,
        exifOrientation: 0,
        crop: file.meta['crop'] as Attachment['crop'] | undefined,
        data: new Uint8Array(),
        mime: file.type,
      }
      res(attachment)
    }
  })
}

export async function cryptoBase64Checksum(base: string): Promise<string> {
  const base64 = base.replace(/^data:[^;]+;base64,/, '')

  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // Generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}
