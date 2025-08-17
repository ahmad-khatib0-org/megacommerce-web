import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { Meta, UppyFile } from '@uppy/core'

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
        crop: file.meta.crop as Attachment['crop'] | undefined,
      }
      res(attachment)
    }
  })
}
