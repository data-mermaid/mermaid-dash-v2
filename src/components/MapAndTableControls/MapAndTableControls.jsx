import { useContext } from 'react'
import PropTypes from 'prop-types'

import styled, { css } from 'styled-components'
import { bbox } from '@turf/bbox'
import { points } from '@turf/helpers'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'

import ViewToggle from './components/ViewToggle'

const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 5rem;
  height: 4rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    top: 1rem;
    left: 8.5rem;
  `)}
`

const MapAndTableControls = ({ map = undefined, view, setView }) => {
  const { displayedProjects } = useContext(FilterProjectsContext)
  const { isDesktopWidth } = useResponsive()

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
      {isDesktopWidth && (
        <ViewToggle
          view={view}
          setView={setView}
          handleZoomToFilteredData={handleZoomToFilteredData}
        />
      )}
    </ControlContainer>
  )
}

MapAndTableControls.propTypes = {
  map: PropTypes.object,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default MapAndTableControls
