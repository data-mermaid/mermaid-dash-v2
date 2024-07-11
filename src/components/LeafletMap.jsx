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
import theme from '../theme'
import MapAndTableControls from './MapAndTableControls'

const defaultMapCenter = [32, -79]
const defaultMapZoom = 2
const mobileWidthThreshold = 960

const CircleMarkerPathOptions = {
  color: `${theme.color.white}`,
  fillColor: '#A53434',
  fillOpacity: 1,
}
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
  const {
    displayedProjects,
    selectedMarkerId,
    setSelectedMarkerId,
    showFilterPane,
    showMetricsPane,
    view,
    setView,
    projectDataCount,
  } = props
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
  const prevSelectedMarkerId = usePrevious(selectedMarkerId)
  const prevShowFilterPane = usePrevious(showFilterPane)
  const prevShowMetricsPane = usePrevious(showMetricsPane)
  const [markers, setMarkers] = useState(null)
  const [map, setMap] = useState(null)

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const toggleMapZoomControls = (map) => {
    if (window.innerWidth > mobileWidthThreshold) {
      map.zoomControl.setPosition('bottomright')
      map.zoomControl.addTo(map)
    } else {
      map.zoomControl.remove()
    }
  }

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
        toggleMapZoomControls(map)
      },
    })

    if (window.innerWidth >= mobileWidthThreshold) {
      map.attributionControl.setPrefix('Leaflet')
    } else {
      map.attributionControl.setPrefix(false)
    }

    const showFilterPaneChanged = showFilterPane !== prevShowFilterPane
    const showMetricsPaneChanged = showMetricsPane !== prevShowMetricsPane

    if (showFilterPaneChanged || showMetricsPaneChanged) {
      // Force map to load more tiles when panes are shown/hidden. A timeout is required
      setTimeout(() => {
        map.invalidateSize()
      }, 10)
    }

    toggleMapZoomControls(map)

    return (
      <MapAndTableControls
        map={map}
        displayedProjects={displayedProjects}
        projectDataCount={projectDataCount}
        view={view}
        setView={setView}
      />
    )
  }

  const addAndRemoveMarkersBasedOnFilters = useEffect(() => {
    const displayedProjectsChanged = displayedProjects !== prevDisplayedProjects
    const selectedMarkerChanged = selectedMarkerId !== prevSelectedMarkerId

    if (displayedProjectsChanged || selectedMarkerChanged) {
      const records = displayedProjects.flatMap((project) => {
        return project.records.map((record) => {
          return {
            ...record,
          }
        })
      })

      const recordMarkers = records.map((record, index) => {
        const isSelected = selectedMarkerId === record.sample_event_id
        const recordPassesAllFilters = records.find(
          (record) => record.sample_event_id === selectedMarkerId,
        )

        return isSelected && recordPassesAllFilters ? (
          <Marker
            key={`${index}-${record.sample_event_id}`}
            position={[record.latitude, record.longitude]}
            title={record.sample_event_id}
            icon={selectedIcon}
          ></Marker>
        ) : (
          <CircleMarker
            key={`${index}-${record.sample_event_id}`}
            center={[record.latitude, record.longitude]}
            pathOptions={CircleMarkerPathOptions}
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
  }, [
    displayedProjects,
    prevDisplayedProjects,
    queryParams,
    selectedMarkerId,
    prevSelectedMarkerId,
    updateURLParams,
  ])

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      maxZoom={20}
      ref={setMap}
    >
      <MapEventListener />
      <MarkerClusterGroup
        // TODO: Experiment with some of the "chunked" props to see if they improve performance: https://akursat.gitbook.io/marker-cluster/api
        chunkedLoading
        spiderfyOnMaxZoom={false}
        onClick={(event) => {
          console.log('Click marker cluster group', event)
          // Add a click event handler here if required
        }}
      >
        {markers}
      </MarkerClusterGroup>
      <TileLayer url={import.meta.env.VITE_REACT_APP_ESRI_TILES_URL} />
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  // TODO: Add more detail here. What is the shape of the objects in the array?
  displayedProjects: PropTypes.array,
  selectedMarkerId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  setSelectedMarkerId: PropTypes.func.isRequired,
  showFilterPane: PropTypes.bool.isRequired,
  showMetricsPane: PropTypes.bool.isRequired,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
  projectDataCount: PropTypes.number.isRequired,
}
