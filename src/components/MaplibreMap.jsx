import { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Layer, NavigationControl, Source } from 'react-map-gl'

import { FilterProjectsContext } from '../context/FilterProjectsContext'
import usePrevious from '../hooks/usePrevious'
import useResponsive from '../hooks/useResponsive'

import customIcon from '../assets/map-pin.png'
import { MAIN_MAP_ID, MAP_VIEW, TABLE_VIEW } from '../constants/constants'

import MapAndTableControls from './MapAndTableControls/MapAndTableControls'

const defaultLon = 130
const defaultLat = -7

const sitesClusterLayer = {
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#a53434',
    'circle-radius': ['step', ['get', 'point_count'], 15, 50, 20, 500, 25],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
}

const sitesClusterCountLayer = {
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Open Sans Semibold'],
    'text-size': 13,
  },
  paint: {
    'text-color': '#fff',
  },
}

const getSitesUnclusteredLayerStyle = (selectedFeatureId) => {
  return {
    type: 'circle',
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      ['!=', ['get', 'sample_event_id'], selectedFeatureId],
    ],
    paint: {
      'circle-color': '#a53434',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  }
}

const getSitesSelectedLayerStyle = (selectedFeatureId) => {
  return {
    type: 'symbol',
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      ['==', ['get', 'sample_event_id'], selectedFeatureId],
    ],
    layout: {
      'icon-image': 'custom-icon',
      'icon-size': 1,
      'icon-anchor': 'bottom',
    },
  }
}

const isValidLatLng = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lat !== null && lng >= -180 && lng <= 180 && lng !== null
}

const isValidZoom = (zoom) => {
  return zoom >= 0 && zoom <= 20 && zoom !== null
}

const sitesSource = {
  type: 'geojson',
  cluster: true,
  clusterMaxZoom: 14, // Max zoom to cluster points on
  clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
}

const MaplibreMap = ({ mapRef, mapWidth, view, setView, isFilterPaneShowing }) => {
  const { isDesktopWidth, isShorterWindowHeight } = useResponsive()
  const {
    displayedProjects,
    enableFollowScreen,
    selectedMarkerId,
    setMapBbox,
    updateCurrentSampleEvent,
  } = useContext(FilterProjectsContext)
  const prevDisplayedProjects = usePrevious(displayedProjects)
  const location = useLocation()
  const navigate = useNavigate()
  const getURLParamsSnapshot = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
  const initialQueryParams = getURLParamsSnapshot()
  const initialQueryParamsLat = initialQueryParams.get('lat')
  const initialQueryParamsLng = initialQueryParams.get('lng')
  const initialQueryParamsZoom = initialQueryParams.get('zoom')
  const queryParamsBbox = initialQueryParams.get('bbox')
  const initialMapCenter = isValidLatLng(initialQueryParamsLat, initialQueryParamsLng)
    ? [initialQueryParamsLat, initialQueryParamsLng]
    : [defaultLat, defaultLon]
  const defaultMapZoom = isShorterWindowHeight ? 1.2 : 2.5
  const initialMapZoom = isValidZoom(initialQueryParamsZoom)
    ? initialQueryParamsZoom
    : defaultMapZoom
  const prevSelectedMarkerId = usePrevious(selectedMarkerId)
  const [sitesFeatureClass, setSitesFeatureClass] = useState(null)

  const updateURLParams = useCallback(
    (newQueryParams) => {
      navigate(`${location.pathname}?${newQueryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const _updateMapBbox = useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!enableFollowScreen || !map) {
      return
    }
    const bounds = map.getBounds()
    setMapBbox(bounds)
  }, [enableFollowScreen, setMapBbox, mapRef])

  const _addAndRemoveMarkersBasedOnFilters = useEffect(() => {
    const displayedProjectsChanged =
      JSON.stringify(displayedProjects) !== JSON.stringify(prevDisplayedProjects)
    const selectedMarkerChanged = selectedMarkerId !== prevSelectedMarkerId

    if (displayedProjectsChanged || selectedMarkerChanged) {
      const features = displayedProjects.flatMap((project) => {
        return project.records
          .map((record) => {
            return {
              type: 'Feature',
              properties: { ...record },
              geometry: { type: 'Point', coordinates: [record.longitude, record.latitude] },
            }
          })
          .filter((feature) => feature !== undefined)
      })

      const featureClass = {
        type: 'FeatureCollection',
        features,
      }

      setSitesFeatureClass(featureClass)
    }
  }, [displayedProjects, prevDisplayedProjects, selectedMarkerId, prevSelectedMarkerId])

  const handleMoveEnd = () => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }
    const { lat, lng } = map.getCenter()
    const zoom = map.getZoom()
    const newQueryParams = getURLParamsSnapshot()
    const bounds = map.getBounds()

    newQueryParams.set('lat', lat)
    newQueryParams.set('lng', lng)
    newQueryParams.set('zoom', zoom)
    updateURLParams(newQueryParams)
    setMapBbox(bounds)
  }

  const handleClick = async (event) => {
    const { features } = event

    if (features && features.length > 0) {
      const clickedFeature = features[0]
      if (clickedFeature.layer.id === 'sites-cluster-layer') {
        const clusterId = clickedFeature.properties.cluster_id
        const zoom = await mapRef.current
          .getSource('sites-source')
          .getClusterExpansionZoom(clusterId)

        mapRef.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom + 2,
        })
        return
      }

      if (clickedFeature.layer.id === 'sites-unclustered-layer') {
        const { sample_event_id } = clickedFeature.properties
        updateCurrentSampleEvent(sample_event_id)

        return
      }
    }
  }

  const handleMouseEnter = (event) => {
    const { features } = event

    if (features && features.length > 0) {
      const feature = features[0]
      if (['sites-cluster-layer', 'sites-unclustered-layer'].includes(feature.layer.id)) {
        mapRef.current.getCanvas().style.cursor = 'pointer'
      }
    }
  }

  const handleMouseLeave = (event) => {
    const { features } = event

    if (features && features.length > 0) {
      const feature = features[0]
      if (['sites-cluster-layer', 'sites-unclustered-layer'].includes(feature.layer.id)) {
        mapRef.current.getCanvas().style.cursor = ''
      }
    }
  }

  const viewAndZoomControlsWrapper = mapRef.current?.getMap() ? (
    <MapAndTableControls
      map={mapRef.current.getMap()}
      mapWidth={mapWidth}
      view={view}
      setView={setView}
      isFilterPaneShowing={isFilterPaneShowing}
    />
  ) : null

  const hideMapStyleLayers = (map) => {
    const layerIdsToHide = [
      'background',
      'coastline',
      'countries-fill',
      'countries-boundary',
      'geolines',
      'geolines-label',
      'countries-label',
      'crimea-fill',
    ]
    map.getStyle().layers.forEach((layer) => {
      if (layerIdsToHide.includes(layer.id)) {
        map.setLayoutProperty(layer.id, 'visibility', 'none')
      }
    })
  }

  const addCustomIcon = (map) => {
    const customImage = new Image()
    customImage.onload = () => {
      if (!map.hasImage('custom-icon')) {
        mapRef.current.addImage('custom-icon', customImage, { sdf: false })
      }
    }
    customImage.src = customIcon
  }

  const fitMapToInitialBoundingBoxQueryParam = (map) => {
    if (queryParamsBbox) {
      const queryParams = new URLSearchParams(location.search)
      const bboxArray = queryParamsBbox.split(',').map(Number)

      map.fitBounds(bboxArray, {
        padding: 20,
        maxZoom: 17,
      })

      queryParams.delete('bbox')
      updateURLParams(queryParams)
    }
  }

  const handleMapLoad = () => {
    if (!mapRef.current) {
      return
    }

    const map = mapRef.current.getMap()

    addCustomIcon(map)
    hideMapStyleLayers(map)
    fitMapToInitialBoundingBoxQueryParam(map)

    const bounds = map.getBounds()
    setMapBbox(bounds)
  }

  return (
    <>
      <Map
        id={MAIN_MAP_ID}
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          longitude: initialMapCenter?.[1] ?? defaultLon,
          latitude: initialMapCenter?.[0] ?? defaultLat,
          zoom: initialMapZoom ?? defaultMapZoom,
        }}
        mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${import.meta.env.VITE_REACT_APP_MAP_TILER_API_KEY}`}
        onLoad={handleMapLoad}
        onMoveEnd={handleMoveEnd}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={['sites-cluster-layer', 'sites-unclustered-layer']}
        attributionControl={false}
      >
        {viewAndZoomControlsWrapper}
        {isDesktopWidth && <NavigationControl showCompass={false} position="bottom-right" />}

        <Source id="sites-source" data={sitesFeatureClass} {...sitesSource}>
          <Layer id="sites-cluster-layer" {...sitesClusterLayer} />
          <Layer id="sites-cluster-count-layer" {...sitesClusterCountLayer} />
          <Layer
            id="sites-unclustered-layer"
            {...getSitesUnclusteredLayerStyle(selectedMarkerId)}
          />
          <Layer id="sites-selected-layer" {...getSitesSelectedLayerStyle(selectedMarkerId)} />
        </Source>
      </Map>
    </>
  )
}

MaplibreMap.propTypes = {
  mapRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  mapWidth: PropTypes.number.isRequired,
  view: PropTypes.oneOf([MAP_VIEW, TABLE_VIEW]).isRequired,
  setView: PropTypes.func.isRequired,
  isFilterPaneShowing: PropTypes.bool.isRequired,
}

export default MaplibreMap
