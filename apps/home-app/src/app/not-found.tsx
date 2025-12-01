import Link from 'next/link'
import { Trans } from '@megacommerce/shared/server'

interface NotFoundProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NotFound({ searchParams }: NotFoundProps) {
  const lang = await Trans.getUserLang()
  const params = await searchParams
  const defaultMessage = Trans.tr(lang, 'pages.page_not_found.message')

  const defaultCode = '404'

  const message =
    typeof params?.message === 'string'
      ? params.message
      : Array.isArray(params?.message)
      ? params.message[0]
      : defaultMessage

  const code =
    typeof params?.code === 'string'
      ? params.code
      : Array.isArray(params?.code)
      ? params.code[0]
      : defaultCode

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-200'>
        <div className='text-center space-y-6'>
          <div className='relative'>
            <h1 className='text-9xl font-black text-gray-900 opacity-10 absolute -top-4 left-1/2 transform -translate-x-1/2'>
              {code}
            </h1>
            <h1 className='text-8xl font-bold text-gray-900 relative z-10'>{code}</h1>
          </div>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold text-gray-800'>{Trans.tr(lang, 'pages.page_not_found')}</h2>
            <div className='w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full'></div>
          </div>
          <p className='text-gray-600 text-lg leading-relaxed px-4'>{message}</p>
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Link
              href='/'
              className='flex-1 w-max inline-flex items-center justify-center px-6 py-2 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg transition-all duration-200'>
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
              </svg>
              {Trans.tr(lang, 'pages.go_back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
