import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { bbox } from '@turf/bbox'
import { points } from '@turf/helpers'

import FilterIndicatorPill from './components/FilterIndicatorPill'
import ViewToggle from './components/ViewToggle'
import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import { ButtonSecondary } from '../generic'
import zoomToFiltered from '../../assets/zoom_to_filtered.svg'
import useResponsive from '../../hooks/useResponsive'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { IconClose } from '../../assets/icons'
import { Column, Row } from '../generic/positioning'
import theme from '../../styles/theme'
import { useContext } from 'react'

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

const MapAndTableControlsButtonSecondary = styled(ButtonSecondary)`
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`

const FilterControlContainer = styled(Column)`
  height: 6rem;
  border: solid 1px ${theme.color.secondaryBorder};
`

const FilterControlButton = styled(MapAndTableControlsButtonSecondary)`
  border: none;
  border-top: solid 1px ${theme.color.secondaryBorder};
`

const ZoomToFilterButton = styled(FilterControlButton)`
  border-right: solid 1px ${theme.color.secondaryBorder};
`

const CloseButton = styled(FilterControlButton)`
  width: 100%;
  justify-content: center;

  & svg {
    height: 24px;
    width: 24px;
  }
`

const MapAndTableControls = ({ map = undefined, view, setView }) => {
  const {
    clearAllFilters,
    displayedProjects,
    getActiveProjectCount,
    isAnyActiveFilters,
    projectDataCount,
  } = useContext(FilterProjectsContext)
  const { isDesktopWidth } = useResponsive()
  const isMapView = view === 'mapView'

  const handleZoomToFilteredData = () => {
    if (!map || !displayedProjects || displayedProjects.length === 0) {
      return
    }
    const coordinates = displayedProjects.flatMap((project) =>
      project.records.map((record) => [record.longitude, record.latitude]),
    )

    if (coordinates.length === 0) {
      return
    }

    const bounds = bbox(points(coordinates))
    map.fitBounds(bounds)
  }

  return (
    <ControlContainer>
      {isAnyActiveFilters() ? (
        <FilterControlContainer>
          <FilterIndicatorPill
            searchFilteredRowLength={getActiveProjectCount()}
            unfilteredRowLength={projectDataCount}
          />
          <Row>
            {isMapView ? (
              <ZoomToFilterButton onClick={handleZoomToFilteredData}>
                <img src={zoomToFiltered} alt="Zoom to filtered data icon" />
                Zoom
              </ZoomToFilterButton>
            ) : null}
            <CloseButton type="button" onClick={clearAllFilters}>
              <IconClose /> Clear
            </CloseButton>
          </Row>
        </FilterControlContainer>
      ) : null}
      {isDesktopWidth ? (
        <ViewToggle view={view} setView={setView} displayedProjects={displayedProjects} />
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
