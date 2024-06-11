import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import '../customStyles.css'
import customIcon from '../styles/Icons/map-pin.png'
import usePrevious from '../library/usePrevious'

const defaultMapCenter = [32, -79]
const defaultMapZoom = 2

const selectedIcon = L.icon({
  iconUrl: customIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 10],
  popupAnchor: [0, 0],
})

const isValidLatLng = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lat !== null && lng >= -180 && lng <= 180 && lng !== null
}

const isValidZoom = (zoom) => {
  return zoom >= 0 && zoom <= 20 && zoom !== null
}

export default function LeafletMap(props) {
  const { displayedProjects } = props
  const prevDisplayedProjects = usePrevious(displayedProjects)

  const location = useLocation()
  const navigate = useNavigate()

  const getURLParams = () => new URLSearchParams(location.search)

  const queryParams = getURLParams()
  const queryParamsLat = queryParams.get('lat')
  const queryParamsLng = queryParams.get('lng')
  const queryParamsZoom = queryParams.get('zoom')
  const initialMapCenter = isValidLatLng(queryParamsLat, queryParamsLng)
    ? [queryParamsLat, queryParamsLng]
    : defaultMapCenter
  const initialMapZoom = isValidZoom(queryParamsZoom) ? queryParamsZoom : defaultMapZoom
  const [mapCenter, setMapCenter] = useState(initialMapCenter)
  const [mapZoom, setMapZoom] = useState(initialMapZoom)
  const queryParamsSampleEventId = queryParams.get('sample_event_id')
  const initialSelectedMarker =
    queryParamsSampleEventId !== null
      ? {
          options: {
            sample_event_id: queryParamsSampleEventId,
          },
        }
      : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const prevSelectedMarkerId = usePrevious(selectedMarkerId)
  const [markers, setMarkers] = useState(null)

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  function MapEventListener() {
    const map = useMapEvents({
      moveend: () => {
        const { lat, lng } = map.getCenter()
        const zoom = map.getZoom()
        const queryParams = getURLParams()
        queryParams.set('lat', lat)
        queryParams.set('lng', lng)
        queryParams.set('zoom', zoom)
        updateURLParams(queryParams)
        setMapCenter([lat, lng])
        setMapZoom(zoom)
      },
    })

    return null
  }

  useEffect(() => {
    const displayedProjectsChanged = displayedProjects !== prevDisplayedProjects
    const selectedMarkerChanged = selectedMarkerId !== prevSelectedMarkerId

    if (displayedProjectsChanged || selectedMarkerChanged) {
      const records = displayedProjects.flatMap((project) => {
        return project.records.map((record) => {
          return {
            ...record
          }
        })
      })
      
      const recordMarkers = records.map((record, index) => {
        const isSelected = selectedMarkerId === record.sample_event_id

        return isSelected ? (
          <Marker
            key={`${index}-${record.sample_event_id}`}
            position={[record.latitude, record.longitude]}
            title={record.sample_event_id}
            icon={selectedIcon}
          ></Marker>) : (
          <CircleMarker
            key={`${index}-${record.sample_event_id}`}
            center={[record.latitude, record.longitude]}
            pathOptions={{ color: 'white', fillColor: 'red', fillOpacity: 1}}
            radius={8}
            eventHandlers={{
              click: () => {
                queryParams.set('sample_event_id', record.sample_event_id)
                updateURLParams(queryParams)
                setSelectedMarkerId(record.sample_event_id)
                console.log('TODO: display sample event in metrics pane', record)
              },
            }}
          ></CircleMarker>
        )
      })
      
      setMarkers(recordMarkers)
    }
  }, [displayedProjects, prevDisplayedProjects, queryParams, selectedMarkerId, prevSelectedMarkerId, updateURLParams])

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} maxZoom={20}>
      <MapEventListener />
      <MarkerClusterGroup
        // TODO: Experiment with some of the "chunked" props to see if they improve performance: https://akursat.gitbook.io/marker-cluster/api
        chunkedLoading
        spiderfyOnMaxZoom={false}
        onClick={(event) => {
          console.log("Click marker cluster group", event)
          // Add a click event handler here if required
        }}
      >
        {markers}
      </MarkerClusterGroup>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  // TODO: Add more detail here. What is the shape of the objects in the array?
  displayedProjects: PropTypes.array,
}