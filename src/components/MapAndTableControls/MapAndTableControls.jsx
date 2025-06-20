import { useContext } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { bbox } from '@turf/bbox'
import { points } from '@turf/helpers'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import theme from '../../styles/theme'

import { imgIconAltText, mapControlButtonText, tooltipText } from '../../constants/language'
import { MAP_VIEW, TABLE_VIEW, URL_PARAMS } from '../../constants/constants'

import zoomToFiltered from '../../assets/zoom_to_filtered.svg'

import { ButtonSecondary } from '../generic'
import { ResponsiveTooltip } from '../generic/ResponsiveTooltip'
import FilterIndicatorPill from '../generic/FilterIndicatorPill'
import { BiggerIconMapOutline, BiggerIconTable } from '../MetricsPane/SelectedSiteMetrics.styles'
import ProjectTableDownload from '../ProjectTableDownload/ProjectTableDownload'

const ControlContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: 7rem;
  height: 4rem;
  z-index: 2;
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

const StyledZoomToFilterIconButton = styled(ButtonSecondary)`
  height: 100%;
  margin: 0rem 1rem;
`

const StyledDataViewButton = styled(ButtonSecondary)`
  height: 100%;
  background-color: ${({ isActive }) =>
    isActive ? theme.color.secondaryColor : theme.color.white};
`

const StyledZoomToFilterButton = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin: 0rem 1rem;
`

const MapAndTableControls = ({
  map = null,
  mapWidth = 0,
  view,
  setView,
  isFilterPaneShowing = false,
}) => {
  const {
    displayedProjects,
    isAnyActiveFilters,
    getActiveProjectCount,
    projectData,
    clearAllFilters,
    setSelectedProject,
  } = useContext(FilterProjectsContext)
  const { isDesktopWidth } = useResponsive()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  const handleMapView = () => {
    setView(MAP_VIEW)
    setSelectedProject(null)
    queryParams.delete(URL_PARAMS.VIEW)
    queryParams.delete(URL_PARAMS.PROJECT_ID)
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

  const handleTableView = () => {
    setView(TABLE_VIEW)
    queryParams.set(URL_PARAMS.VIEW, TABLE_VIEW)
    queryParams.delete(URL_PARAMS.SAMPLE_EVENT_ID)
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

  const handleZoomToFilteredData = () => {
    if (!map || !displayedProjects || displayedProjects.length === 0) {
      return
    }

    const normalizeLongitudeWithinRange = (lon) => {
      return (lon + 360) % 360
    }

    const coordinates = displayedProjects.flatMap((project) =>
      project.records.map((record) => {
        const newLon = normalizeLongitudeWithinRange(record.longitude)
        return [newLon, record.latitude]
      }),
    )

    if (coordinates.length === 0) {
      return
    }

    const bounds = bbox(points(coordinates))
    map.fitBounds(bounds, { maxZoom: 17, padding: 20 })
  }

  return (
    <ControlContainer>
      {isDesktopWidth && (
        <StyledViewToggleContainer view={view}>
          <ResponsiveTooltip title={tooltipText.mapView}>
            <StyledDataViewButton isActive={view === MAP_VIEW} onClick={handleMapView}>
              <BiggerIconMapOutline />
            </StyledDataViewButton>
          </ResponsiveTooltip>
          <ResponsiveTooltip title={tooltipText.tableView}>
            <StyledDataViewButton isActive={view === TABLE_VIEW} onClick={handleTableView}>
              <BiggerIconTable />
            </StyledDataViewButton>
          </ResponsiveTooltip>
          {view === MAP_VIEW ? (
            <>
              {mapWidth < 500 ? (
                <ResponsiveTooltip
                  title={isAnyActiveFilters() ? tooltipText.zoomToData : tooltipText.showAllData}
                >
                  <StyledZoomToFilterIconButton onClick={handleZoomToFilteredData}>
                    <img src={zoomToFiltered} alt={imgIconAltText.zoomToFilteredData} />
                  </StyledZoomToFilterIconButton>
                </ResponsiveTooltip>
              ) : (
                <StyledZoomToFilterButton onClick={handleZoomToFilteredData}>
                  <img src={zoomToFiltered} alt={imgIconAltText.zoomToFilteredData} />
                  <span>
                    {isAnyActiveFilters()
                      ? mapControlButtonText.zoomToData
                      : mapControlButtonText.showAllData}
                  </span>
                </StyledZoomToFilterButton>
              )}
              {!isFilterPaneShowing &&
              isAnyActiveFilters() &&
              getActiveProjectCount() < projectData?.count ? (
                <FilterIndicatorPill
                  searchFilteredRowLength={getActiveProjectCount()}
                  unfilteredRowLength={projectData?.count ?? 0}
                  clearFilters={clearAllFilters}
                />
              ) : null}
            </>
          ) : (
            <ProjectTableDownload />
          )}
        </StyledViewToggleContainer>
      )}
    </ControlContainer>
  )
}

MapAndTableControls.propTypes = {
  map: PropTypes.object,
  mapWidth: PropTypes.number,
  view: PropTypes.oneOf([MAP_VIEW, TABLE_VIEW]).isRequired,
  setView: PropTypes.func.isRequired,
  isFilterPaneShowing: PropTypes.bool,
}

export default MapAndTableControls
