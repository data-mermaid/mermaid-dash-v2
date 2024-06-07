import PropTypes from 'prop-types'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const [selectedMarker, setSelectedMarker] = useState(initialSelectedMarker)
  const prevSelectedMarker = usePrevious(selectedMarker)
  const markersRef = useRef(null)

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  function MapEventListener() {
    if (!markersRef.current) {
      markersRef.current = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
      })
    }

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
      clusterClick: () => {
        markersRef.current.on('clusterclick', function (event) {
          console.log(event.layer.getAllChildMarkers().map((marker) => marker.options.sample_event_id))
        })
      }
    })

    if (map.hasLayer(markersRef.current)) {return} 

    map.addLayer(markersRef.current)

    return null
  }

  // TODO: Consider creating a react-leaflet component as a marker layer: e.g. https://react-leaflet.js.org/docs/example-other-layers/
  // A third party library like https://github.com/akursat/react-leaflet-cluster could be useful for handling clustering
  const addNewMarkers = useCallback(() => {
    if (markersRef.current) {
      displayedProjects.forEach((project) => {
        project.records.forEach((record) => {
          const { latitude, longitude, sample_event_id } = record
          let markerAlreadyExists = false
          markersRef.current.getLayers().forEach((layer) => {
            if (layer.options.sample_event_id === sample_event_id) {
              markerAlreadyExists = true
            }
          })
          if (!markerAlreadyExists) {
            const defaultMarker = L.circleMarker([latitude, longitude], {
              color: 'white',
              fillColor: 'red',
              fillOpacity: 1,
              radius: 8,
              sample_event_id,
            }).on('click', function () {
              console.log('TODO: display sample event in metrics pane', record)
              queryParams.set('sample_event_id', sample_event_id)
              updateURLParams(queryParams)
              const customIconMarker = L.marker([latitude, longitude], {
                icon: selectedIcon,
                sample_event_id,
              })
              markersRef.current.addLayer(customIconMarker)
              markersRef.current.removeLayer(defaultMarker)
              setSelectedMarker(customIconMarker)
            })

            const customMarker = L.marker([latitude, longitude], {
              icon: selectedIcon,
              sample_event_id,
            })

            const displayedMarker =
              selectedMarker?.options.sample_event_id === sample_event_id
                ? customMarker
                : defaultMarker

            markersRef.current.addLayer(displayedMarker)
          }
        })
      })
    }}, [displayedProjects, selectedMarker?.options.sample_event_id, queryParams, updateURLParams])



  useEffect(() => {
    const displayedProjectsChanged = displayedProjects !== prevDisplayedProjects
    const selectedMarkerChanged = selectedMarker !== prevSelectedMarker

    if (!displayedProjectsChanged && !selectedMarkerChanged) {return}

    if (markersRef.current) {
      // Remove any existing markers/sample events that are not in the displayedProjects
      markersRef.current.getLayers().forEach((layer) => {
        let sampleEventExists = displayedProjects.some((project) => {
          project.records.some((record) => record.sample_event_id === layer.options.sample_event_id)
        })
        if (!sampleEventExists) {
          markersRef.current.removeLayer(layer)
        }
      })
      addNewMarkers()
    }
  }, [displayedProjects, prevDisplayedProjects, addNewMarkers, selectedMarker, prevSelectedMarker])

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} maxZoom={20}>
      <MapEventListener />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  displayedProjects: PropTypes.array.isRequired,
}
