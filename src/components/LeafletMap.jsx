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
import styled from 'styled-components'
import { ButtonSecondary } from './generic/buttons'
import zoomToSelectedSites from '../styles/Icons/zoom_to_selected_sites.svg'
import zoomToFiltered from '../styles/Icons/zoom_to_filtered.svg'

const defaultMapCenter = [32, -79]
const defaultMapZoom = 2

const Tooltip = styled.span`
  visibility: hidden;
  width: max-content;
  background-color: ${theme.color.primaryColor};
  color: ${theme.color.white};
  text-align: center;
  border-radius: 6px;
  padding: 0.7rem;
  position: relative;
  z-index: 4;
  bottom: -2.5rem;
  left: 150%;
  margin-left: -15rem;
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: ${theme.typography.defaultFontSize};
  width: 20rem;

  &::after {
    content: '';
    position: absolute;
    top: -4rem;
    left: 39%;
    margin-left: -0rem;
    border-width: 2rem;
    border-style: solid;
    border-color: transparent transparent ${theme.color.primaryColor} transparent;
  }
`

const TooltipContainer = styled.div`
  display: inline-block;
  height: 6rem;
  &:hover ${Tooltip} {
    visibility: visible;
  }
`
const ZoomToSecondaryButton = styled(ButtonSecondary)`
  padding-top: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-left: 0.5rem;
  height: 100%;
`
const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 16.5rem;
  width: 10rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
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
  const { displayedProjects, selectedMarkerId, setSelectedMarkerId } = props
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
  const [markers, setMarkers] = useState(null)
  const [map, setMap] = useState(null)

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

    return (
      <ControlContainer>
        {isAnyActiveFilters() ? (
          <TooltipContainer>
            <ZoomToSecondaryButton onClick={handleZoomToFilteredData}>
              <img src={zoomToFiltered} alt="Zoom to filtered data" />
            </ZoomToSecondaryButton>
            <Tooltip>Zoom to filtered data</Tooltip>
          </TooltipContainer>
        ) : null}
        {hasSelectedSite() ? (
          <TooltipContainer>
            <ZoomToSecondaryButton onClick={handleZoomToSelectedSite}>
              <img src={zoomToSelectedSites} alt="Zoom to selected site" />
            </ZoomToSecondaryButton>
            <Tooltip>Zoom to selected site</Tooltip>
          </TooltipContainer>
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
    <>
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
        <TileLayer
          url={import.meta.env.VITE_REACT_APP_ESRI_TILES_URL}
          attribution="Tiles &copy; Esri"
        />
      </MapContainer>
    </>
  )
}

LeafletMap.propTypes = {
  // TODO: Add more detail here. What is the shape of the objects in the array?
  displayedProjects: PropTypes.array,
}
