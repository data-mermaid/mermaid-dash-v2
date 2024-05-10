import { useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../customStyles.css'

const defaultMapCenter = [45.4, -75.7]
const defaultMapZoom = 12

export default function LeafletMap() {
  const params = new URLSearchParams(window.location.search)
  const paramsMapCenter = [parseFloat(params.get('lat')), parseFloat(params.get('lng'))]
  const initialMapCenter = paramsMapCenter.every((coord) => !isNaN(coord))
    ? paramsMapCenter
    : defaultMapCenter
  const initialMapZoom = parseInt(params.get('zoom')) || defaultMapZoom
  const [mapCenter, setMapCenter] = useState(initialMapCenter)
  const [mapZoom, setMapZoom] = useState(initialMapZoom)

  function MapEventListener() {
    const map = useMap()

    map.on('moveend', () => {
      // const bounds = map.getBounds()
      const { lat, lng } = map.getCenter()
      const zoom = map.getZoom()
      // console.log('Bbox:', bounds.toBBoxString())

      const baseUrl =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '')
      const url = new URL(baseUrl)
      const params = new URLSearchParams()
      params.append('lat', lat)
      params.append('lng', lng)
      params.append('zoom', zoom)
      url.search = params.toString()
      const finalUrl = url.toString()
      window.history.pushState({}, '', finalUrl)
      setMapCenter([lat, lng])
      setMapZoom(zoom)
    })

    return null
  }

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
      <MapEventListener />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
    </MapContainer>
  )
}
