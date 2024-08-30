import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { bbox } from '@turf/bbox'
import { points } from '@turf/helpers'

import FilterIndicatorPill from './components/FilterIndicatorPill'
import ViewToggle from './components/ViewToggle'
import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import { ButtonSecondary } from '../generic'
import zoomToSelectedSites from '../../assets/zoom_to_selected_sites.svg'
import zoomToFiltered from '../../assets/zoom_to_filtered.svg'
import useResponsive from '../../hooks/useResponsive'
import { useFilterProjectsContext } from '../../context/FilterProjectsContext'

const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 10.5rem;
  height: 6rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    top: 1rem;
    left: 8.5rem;
  `)}
`

const ZoomToSecondaryButton = styled(ButtonSecondary)`
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`

const MapAndTableControls = ({ map = undefined, view, setView }) => {
  const { displayedProjects, projectDataCount, getActiveProjectCount, isAnyActiveFilters } =
    useFilterProjectsContext()
  const { isDesktopWidth } = useResponsive()
  const queryParams = new URLSearchParams(location.search)

  const handleZoomToFilteredData = () => {
    if (!map || !displayedProjects || displayedProjects.length === 0) {
      return
    }
    const coordinates = displayedProjects.flatMap((project) => {
      return project.records.map((record) => [record.longitude, record.latitude])
    })

    if (coordinates.length === 0) {
      return
    }

    let bounds

    bounds = bbox(points(coordinates))
    map.fitBounds(bounds)
  }

  const handleZoomToSelectedSite = () => {
    if (!map) {
      return
    }

    if (queryParams.has('sample_event_id')) {
      const sample_event_id = queryParams.get('sample_event_id')
      const foundSampleEvent = displayedProjects
        .flatMap((project) => project.records)
        .find((record) => record.sample_event_id === sample_event_id)
      if (!foundSampleEvent) {
        return
      }
      const { latitude, longitude } = foundSampleEvent
      map.setCenter([longitude, latitude])
      map.setZoom(18)
    }
  }

  const hasSelectedSite = () => {
    return queryParams.has('sample_event_id')
  }

  return (
    <ControlContainer>
      {isAnyActiveFilters() ? (
        <FilterIndicatorPill
          searchFilteredRowLength={getActiveProjectCount()}
          unfilteredRowLength={projectDataCount}
        />
      ) : null}
      {isDesktopWidth ? (
        <ViewToggle view={view} setView={setView} displayedProjects={displayedProjects} />
      ) : null}
      {isAnyActiveFilters() && view === 'mapView' ? (
        <ZoomToSecondaryButton
          onClick={handleZoomToFilteredData}
          aria-labelledby="Zoom to filtered data button"
        >
          <img src={zoomToFiltered} alt="Zoom to filtered data" />
          {isDesktopWidth ? <span>Filtered Data</span> : null}
        </ZoomToSecondaryButton>
      ) : null}
      {hasSelectedSite() && view === 'mapView' ? (
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

MapAndTableControls.propTypes = {
  map: PropTypes.object,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default MapAndTableControls
