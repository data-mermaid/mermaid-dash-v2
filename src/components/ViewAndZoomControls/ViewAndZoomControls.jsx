import { useContext } from 'react'
import PropTypes from 'prop-types'

import styled, { css } from 'styled-components'
import { bbox } from '@turf/bbox'
import { points } from '@turf/helpers'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'

import { ButtonSecondary } from '../generic'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tooltip } from '../generic/Tooltip'
import { tooltipText } from '../../constants/language'
import { BiggerIconMapOutline, BiggerIconTable } from '../MetricsPane/SelectedSiteMetrics.styles'
import theme from '../../styles/theme'
import zoomToFiltered from '../../assets/zoom_to_filtered.svg'
import ProjectTableDownload from '../ProjectTableDownload/ProjectTableDownload'

const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 5rem;
  height: 4rem;
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    top: 1rem;
    left: 8.5rem;
  `)}
`

const StyledViewToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const StyledViewToggleSecondaryButton = styled(ButtonSecondary)`
  height: 100%;
`

const StyledDataViewButton = styled(StyledViewToggleSecondaryButton)`
  background-color: ${({ isActive }) =>
    isActive ? theme.color.secondaryColor : theme.color.white};
`

const ViewAndZoomControls = ({ map = undefined, view, setView }) => {
  const { displayedProjects, isAnyActiveFilters } = useContext(FilterProjectsContext)
  const { isDesktopWidth } = useResponsive()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  const handleMapView = () => {
    setView('mapView')
    queryParams.delete('view')
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

  const handleTableView = () => {
    setView('tableView')
    queryParams.set('view', 'tableView')
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

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
        <StyledViewToggleContainer view={view}>
          <Tooltip text={tooltipText.mapView}>
            <StyledDataViewButton isActive={view === 'mapView'} onClick={handleMapView}>
              <BiggerIconMapOutline />
            </StyledDataViewButton>
          </Tooltip>
          <Tooltip text={tooltipText.tableView}>
            <StyledDataViewButton isActive={view === 'tableView'} onClick={handleTableView}>
              <BiggerIconTable />
            </StyledDataViewButton>
          </Tooltip>
          {view === 'mapView' ? (
            <Tooltip
              text={isAnyActiveFilters() ? tooltipText.zoomToData : tooltipText.showAllData}
              styleProps={{ tooltipMarginLeft: '1rem', tooltipTextWith: '20ch' }}
            >
              <StyledViewToggleSecondaryButton onClick={handleZoomToFilteredData}>
                <img src={zoomToFiltered} alt="Zoom to filtered data icon" />
              </StyledViewToggleSecondaryButton>
            </Tooltip>
          ) : (
            <ProjectTableDownload />
          )}
        </StyledViewToggleContainer>
      )}
    </ControlContainer>
  )
}

ViewAndZoomControls.propTypes = {
  map: PropTypes.object,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default ViewAndZoomControls
