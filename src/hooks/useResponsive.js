import { useState, useEffect } from 'react'

const MOBILE_WIDTH_THRESHOLD = 1080

const useResponsive = () => {
  const [isMobileWidth, setIsMobileWidth] = useState(window.innerWidth <= MOBILE_WIDTH_THRESHOLD)
  const [isDesktopWidth, setIsDesktopWidth] = useState(window.innerWidth > MOBILE_WIDTH_THRESHOLD)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileWidth(window.innerWidth <= MOBILE_WIDTH_THRESHOLD)
      setIsDesktopWidth(window.innerWidth > MOBILE_WIDTH_THRESHOLD)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobileWidth, isDesktopWidth }
}

export default useResponsive
