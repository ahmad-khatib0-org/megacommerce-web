import './page-loader.scss'

export const PageLoader = () => {
  return (
    <div
      className="fixed top-0 left-0 flex items-center justify-center bg-gray-100/65 h-screen w-screen"
      style={{ zIndex: 99999 }}>
      <div className="loader" />
    </div>
  )
}
