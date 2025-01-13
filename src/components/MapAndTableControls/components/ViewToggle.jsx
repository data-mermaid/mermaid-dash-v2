import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'

import theme from '../../../styles/theme'
import { BiggerIconMapOutline, BiggerIconTable } from '../../MetricsPane/SelectedSiteMetrics.styles'
import { ButtonSecondary } from '../../generic'
import zoomToFiltered from '../../../assets/zoom_to_filtered.svg'
import { tooltipText } from '../../../constants/language'

import { Tooltip } from '../../generic/Tooltip'

const StyledViewToggleContainer = styled.div`
  z-index: 400;
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

const ViewToggle = ({ view, setView, handleZoomToFilteredData }) => {
  const { isAnyActiveFilters } = useContext(FilterProjectsContext)
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

  return (
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
      {view === 'mapView' && (
        <Tooltip
          text={isAnyActiveFilters() ? tooltipText.zoomToData : tooltipText.showAllData}
          styleProps={{ tooltipMarginLeft: '1rem', tooltipTextWith: '20ch' }}
        >
          <StyledViewToggleSecondaryButton onClick={handleZoomToFilteredData}>
            <img src={zoomToFiltered} alt="Zoom to filtered data icon" />
          </StyledViewToggleSecondaryButton>
        </Tooltip>
      )}
    </StyledViewToggleContainer>
  )
}

ViewToggle.propTypes = {
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
  handleZoomToFilteredData: PropTypes.func.isRequired,
}

export default ViewToggle
