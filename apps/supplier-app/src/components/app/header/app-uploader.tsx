'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button, Divider, Popover, Progress } from '@mantine/core'
import { IconAlertTriangleFilled, IconSquareCheckFilled, IconUpload } from '@tabler/icons-react'

import { ObjString } from '@megacommerce/shared'
import { useAppStore } from '@/store'
import { AssetsPaths } from '@/static/shared'

type Props = {
  tr: ObjString
}

function AppUploader({ tr }: Props) {
  const [opened, setOpened] = useState(false)
  const uploader = useAppStore((state) => state.uploader)

  if (!uploader.show_uploader) return null
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={500}
      position='bottom'
      withArrow
      shadow='md'
      transitionProps={{ transition: 'slide-up', duration: 250 }}>
      <Popover.Target>
        <div className='bg-white rounded-full p-2 shadow-sm border border-black/30 cursor-pointer'>
          <IconUpload onClick={() => setOpened(true)} />
        </div>
      </Popover.Target>
      <Popover.Dropdown className='max-h-80 overflow-y-auto z-10'>
        {uploader.uploads.map((upload, idx) => (
          <div key={idx} className='flex flex-col gap-y-2 py-4'>
            <p className='font-light line-clamp-1'>{upload.fileName}</p>
            <Progress value={upload.progress} />
            <div className='flex justify-between items-center'>
              {(upload.showCancel ?? false) && (
                <Button
                  onClick={() => (upload.onCancel ? upload.onCancel(upload.id) : () => { })}
                  className='mt-2'
                  size='xs'
                  variant='outline'>
                  {tr.cancel}
                </Button>
              )}
              {(upload.showTryAgain ?? false) && (
                <Button
                  onClick={() => (upload.tryAgain ? upload.tryAgain(upload.id) : () => { })}
                  className='mt-2'
                  size='xs'>
                  {tr.tryAgain}
                </Button>
              )}
            </div>
            {(upload.uploading ?? false) && (
              <div className='flex items-center gap-x-2'>
                <div className='relative size-7'>
                  <Image src={AssetsPaths.uploadFileGif} alt={tr.uploading} sizes='100%' fill unoptimized />
                </div>
                <p>{tr.uploading}</p>
              </div>
            )}
            {(upload.completed ?? false) && (
              <div className='flex items-center gap-x-2'>
                <IconSquareCheckFilled color='green' />
                <p>{tr.completed}</p>
              </div>
            )}
            {(upload.errorMsg?.length ?? 0) > 0 && (
              <div className='flex items-center gap-x-2'>
                <IconAlertTriangleFilled color='red' />
                <p className='font-light leading-5'>{upload.errorMsg}</p>
              </div>
            )}
            {idx + 1 !== uploader.uploads.length && <Divider className='mt-2' size='xl' variant='dotted' />}
          </div>
        ))}
      </Popover.Dropdown>
    </Popover>
  )
}

export default AppUploader
