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
import '../styles/leafletMapContainerStyles.css'
import customIcon from '../assets/map-pin.png'
import usePrevious from '../hooks/usePrevious'
import theme from '../styles/theme'
import MapAndTableControls from './MapAndTableControls/MapAndTableControls'
import { useFilterProjectsContext } from '../context/FilterProjectsContext'
import useResponsive from '../hooks/useResponsive'

const defaultMapCenter = [32, -79]
const defaultMapZoom = 2

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

const LeafletMap = ({ showFilterPane, showMetricsPane, view, setView }) => {
  const { displayedProjects, selectedMarkerId, setSelectedMarkerId, checkedProjects } =
    useFilterProjectsContext()
  const prevDisplayedProjects = usePrevious(displayedProjects)
  const location = useLocation()
  const navigate = useNavigate()
  const getURLParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
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
  const [markers, setMarkers] = useState(null)
  const [map, setMap] = useState(null)
  const { isDesktopWidth } = useResponsive()
  const prevCheckedProjects = usePrevious(checkedProjects)

  const _loadTilesWhenPanelsToggled = useEffect(() => {
    map?.invalidateSize()
  }, [map, showFilterPane, showMetricsPane])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const toggleMapZoomControlAndAttribution = () => {
    if (!map) {
      return
    }
    if (isDesktopWidth) {
      map.attributionControl.setPrefix('Leaflet')
      map.zoomControl.setPosition('bottomright')
      map.zoomControl.addTo(map)
    } else {
      map.attributionControl.setPrefix(false)
      map.zoomControl.remove()
    }
  }

  const MapEventListener = () => {
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
      resize: () => {
        toggleMapZoomControlAndAttribution()
      },
    })

    toggleMapZoomControlAndAttribution()
    return null
  }

  const MapAndTableControlsWrapper = () => {
    return <MapAndTableControls map={map} view={view} setView={setView} />
  }

  const handleClickCircleMarker = useCallback(
    (record) => {
      const { sample_event_id } = record
      queryParams.set('sample_event_id', sample_event_id)
      updateURLParams(queryParams)
      setSelectedMarkerId(sample_event_id)
    },
    [queryParams, setSelectedMarkerId, updateURLParams],
  )

  const _addAndRemoveMarkersBasedOnFilters = useEffect(() => {
    const displayedProjectsChanged =
      JSON.stringify(displayedProjects) !== JSON.stringify(prevDisplayedProjects)
    const selectedMarkerChanged = selectedMarkerId !== prevSelectedMarkerId
    const checkedProjectsChanged = checkedProjects !== prevCheckedProjects

    if (displayedProjectsChanged || selectedMarkerChanged || checkedProjectsChanged) {
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
        const isProjectChecked = checkedProjects.includes(record.project_id)
        if (!isProjectChecked) {
          return null
        }

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
              click: () => handleClickCircleMarker(record),
            }}
          ></CircleMarker>
        )
      })

      setMarkers(recordMarkers)
    }
  }, [
    displayedProjects,
    prevDisplayedProjects,
    selectedMarkerId,
    prevSelectedMarkerId,
    checkedProjects,
    prevCheckedProjects,
    handleClickCircleMarker,
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
      <MapAndTableControlsWrapper />
      <MarkerClusterGroup
        // TODO: Experiment with some of the "chunked" props to see if they improve performance: https://akursat.gitbook.io/marker-cluster/api
        chunkedLoading
        chunkedInterval={2000}
        spiderfyOnMaxZoom={false}
        onClick={(event) => {
          console.log('Click marker cluster group', event)
          // Add a click event handler here if required
        }}
      >
        {markers}
      </MarkerClusterGroup>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  // TODO: Add more detail here. What is the shape of the objects in the array?
  showFilterPane: PropTypes.bool.isRequired,
  showMetricsPane: PropTypes.bool.isRequired,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default LeafletMap
