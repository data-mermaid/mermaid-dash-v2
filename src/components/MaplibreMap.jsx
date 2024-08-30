import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from 'react-map-gl/maplibre'

import 'maplibre-gl/dist/maplibre-gl.css'
import { AttributionControl, Layer, NavigationControl, Source } from 'react-map-gl'
import { useFilterProjectsContext } from '../context/FilterProjectsContext'
import usePrevious from '../hooks/usePrevious'
import { useLocation, useNavigate } from 'react-router-dom'
import useResponsive from '../hooks/useResponsive'
import { useRef } from 'react'
import MapAndTableControls from './MapAndTableControls/MapAndTableControls'
import customIcon from '../assets/map-pin.png'

const defaultLon = -79
const defaultLat = 32
const defaultMapZoom = 1

const basemapLayerStyle = {
  id: 'basemap-layer',
  type: 'raster',
  minzoom: 0,
  maxzoom: 22,
}

const sitesClusterLayer = {
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#a53434',
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
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

const MaplibreMap = ({ view, setView }) => {
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
    : [defaultLat, defaultLon]
  const initialMapZoom = isValidZoom(queryParamsZoom) ? queryParamsZoom : defaultMapZoom
  const [mapCenter, setMapCenter] = useState(initialMapCenter)
  const [mapZoom, setMapZoom] = useState(initialMapZoom)
  const prevSelectedMarkerId = usePrevious(selectedMarkerId)
  const [sitesFeatureClass, setSitesFeatureClass] = useState(null)
  const { isDesktopWidth } = useResponsive()
  const prevCheckedProjects = usePrevious(checkedProjects)

  const mapRef = useRef()

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const toggleMapZoomControlAndAttribution = () => {
    // const map = mapRef.current.getMap()
    // if (!map) {
    //   return
    // }
    // if (isDesktopWidth) {
    //   map.zoomControl.setPosition('bottomright')
    //   map.zoomControl.addTo(map)
    // } else {
    //   map.attributionControl.setPrefix(false)
    //   map.zoomControl.remove()
    // }
  }

  const _addAndRemoveMarkersBasedOnFilters = useEffect(() => {
    const displayedProjectsChanged =
      JSON.stringify(displayedProjects) !== JSON.stringify(prevDisplayedProjects)
    const selectedMarkerChanged = selectedMarkerId !== prevSelectedMarkerId
    const checkedProjectsChanged = checkedProjects !== prevCheckedProjects

    if (displayedProjectsChanged || selectedMarkerChanged || checkedProjectsChanged) {
      const features = displayedProjects.flatMap((project) => {
        return project.records
          .map((record) => {
            const isProjectChecked = checkedProjects.includes(project.project_id)
            if (!isProjectChecked) {
              return
            }

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
  }, [
    displayedProjects,
    prevDisplayedProjects,
    selectedMarkerId,
    prevSelectedMarkerId,
    checkedProjects,
    prevCheckedProjects,
  ])

  const handleMoveEnd = () => {
    const map = mapRef.current.getMap()
    const { lat, lng } = map.getCenter()
    const zoom = map.getZoom()
    const queryParams = getURLParams()

    queryParams.set('lat', lat)
    queryParams.set('lng', lng)
    queryParams.set('zoom', zoom)
    updateURLParams(queryParams)
    setMapCenter([lat, lng])
    setMapZoom(zoom)
  }

  const handleResize = () => {
    toggleMapZoomControlAndAttribution()
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
          zoom,
        })
        return
      }

      if (clickedFeature.layer.id === 'sites-unclustered-layer') {
        const { sample_event_id } = clickedFeature.properties
        queryParams.set('sample_event_id', sample_event_id)
        updateURLParams(queryParams)
        setSelectedMarkerId(sample_event_id)

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

  const MapAndTableControlsWrapper = () => {
    const map = mapRef.current

    if (map) {
      return <MapAndTableControls map={map.getMap()} view={view} setView={setView} />
    }
  }

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

  const handleMapLoad = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap()
      const customImage = new Image()
      customImage.onload = () => {
        if (!map.hasImage('custom-icon')) {
          mapRef.current.addImage('custom-icon', customImage, { sdf: false })
        }
      }
      customImage.src = customIcon
      hideMapStyleLayers(map)
    }
  }

  return (
    <>
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          longitude: (mapCenter && mapCenter[1]) || defaultLon,
          latitude: (mapCenter && mapCenter[0]) || defaultLat,
          zoom: mapZoom || defaultMapZoom,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onLoad={handleMapLoad}
        onMoveEnd={handleMoveEnd}
        onResize={handleResize}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={['sites-cluster-layer', 'sites-unclustered-layer']}
        // disable the default attribution
        attributionControl={false}
      >
        <MapAndTableControlsWrapper />
        <AttributionControl
          compact={true}
          customAttribution="Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
          position={isDesktopWidth ? 'bottom-right' : 'top-right'}
        />
        <NavigationControl
          showCompass={false}
          showZoom={isDesktopWidth ? true : false}
          position="bottom-right"
        />
        <Source
          id="basemap-source"
          type="raster"
          tiles={[
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ]}
        >
          <Layer {...basemapLayerStyle} />
        </Source>
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
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default MaplibreMap
