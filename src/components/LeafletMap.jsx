import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
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
import styled, { css } from 'styled-components'
import { ButtonSecondary } from './generic/buttons'
import zoomToSelectedSites from '../styles/Icons/zoom_to_selected_sites.svg'
import zoomToFiltered from '../styles/Icons/zoom_to_filtered.svg'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import useResponsive from '../library/useResponsive'

const defaultMapCenter = [32, -79]
const defaultMapZoom = 2

const ZoomToSecondaryButton = styled(ButtonSecondary)`
  padding-left: 2rem;
  padding-right: 2rem;
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`
const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 16.5rem;
  height: 6rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
  ${mediaQueryTabletLandscapeOnly(css`
    top: 1rem;
    left: 8rem;
  `)}
`

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
  const { isMobileWidth, isDesktopWidth } = useResponsive()

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const handleZoomToFilteredData = () => {
    if (!displayedProjects || displayedProjects.length === 0) {
      return
    }
    const coordinates = displayedProjects.flatMap((project) =>
      project.records.map((record) => [record.latitude, record.longitude]),
    )
    if (coordinates.length === 0) {
      return
    }
    const bounds = L.latLngBounds(coordinates)
    map.fitBounds(bounds)
  }

  const handleZoomToSelectedSite = () => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.has('sample_event_id')) {
      const sample_event_id = queryParams.get('sample_event_id')
      const foundSampleEvent = displayedProjects
        .flatMap((project) => project.records)
        .find((record) => record.sample_event_id === sample_event_id)
      if (!foundSampleEvent) {
        return
      }
      const { latitude, longitude } = foundSampleEvent
      map.setView([latitude, longitude], 18)
    }
  }

  const isAnyActiveFilters = () => {
    const queryParams = new URLSearchParams(location.search)
    const filterKeys = [
      'countries',
      'organizations',
      'startDate',
      'endDate',
      'method',
      'dataSharing',
      'projectName',
    ]

    return filterKeys.some((key) => queryParams.has(key))
  }

  const hasSelectedSite = () => {
    const queryParams = new URLSearchParams(location.search)
    return queryParams.has('sample_event_id')
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
      },
    })
    return null
  }

  const MapResizeListener = () => {
    const map = useMap()

    const toggleMapZoomControls = (map) => {
      if (isDesktopWidth) {
        map.zoomControl.setPosition('bottomright')
        map.zoomControl.addTo(map)
      } else {
        map.zoomControl.remove()
      }
    }

    const toggleMapAttribution = (map) => {
      if (isDesktopWidth) {
        map.attributionControl.setPrefix('Leaflet')
      } else {
        map.attributionControl.setPrefix(false)
      }
    }

    const _forceLoadMoreTiles = useEffect(() => {
      setTimeout(() => {
        map.invalidateSize()
      })
    }, [showFilterPane, showMetricsPane])

    toggleMapZoomControls(map)
    toggleMapAttribution(map)
  }

  const MapAndTableControlsWrapper = () => {
    return (
      <ControlContainer>
        {isAnyActiveFilters() ? (
          <ZoomToSecondaryButton
            onClick={handleZoomToFilteredData}
            aria-labelledby="Zoom to filtered data button"
          >
            <img src={zoomToFiltered} alt="Zoom to filtered data" />
            {isDesktopWidth ? <span>Filtered Data</span> : null}
          </ZoomToSecondaryButton>
        ) : null}
        {hasSelectedSite() ? (
          <ZoomToSecondaryButton
            onClick={handleZoomToSelectedSite}
            aria-labelledby="Zoom to selected site button"
          >
            <img src={zoomToSelectedSites} alt="Zoom to selected site" />
            {isDesktopWidth ? <span>Selected Site</span> : null}
          </ZoomToSecondaryButton>
        ) : null}
      </ControlContainer>
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
      <MapResizeListener />
      <MapAndTableControlsWrapper />
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
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
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
}
