import { useEffect, useRef, useState } from 'react'

const useMapRef = () => {
  const mapRef = useRef(null)
  const [mapWidth, setMapWidth] = useState(0)
  const resizeObserverRef = useRef(null)

  const observeMapContainer = () => {
    const mapInstance = mapRef.current?.getMap()
    const mapContainer = mapInstance?.getContainer()

    if (mapContainer) {
      if (!resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setMapWidth(entry.contentRect.width)
          }
        })
      }
      resizeObserverRef.current.observe(mapContainer)
    }
  }

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 50

    const intervalId = setInterval(() => {
      attempts++
      const mapInstance = mapRef.current?.getMap()
      const mapContainer = mapInstance?.getContainer()

      if (mapContainer) {
        clearInterval(intervalId)
        observeMapContainer()
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId)
        console.warn('Map container not found after maximum attempts')
      }
    }, 100)

    return () => {
      clearInterval(intervalId)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [])

  const restartObserver = () => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }
    observeMapContainer()
  }

  return { mapRef, mapWidth, restartObserver }
}

export default useMapRef
