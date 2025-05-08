import { useEffect, useRef, useState } from 'react'

const useMapRef = () => {
  const mapRef = useRef(null)
  const [mapWidth, setMapWidth] = useState(null)
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
    const intervalId = setInterval(() => {
      const mapInstance = mapRef.current?.getMap()
      const mapContainer = mapInstance?.getContainer()

      if (mapContainer) {
        clearInterval(intervalId)
        observeMapContainer()
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
