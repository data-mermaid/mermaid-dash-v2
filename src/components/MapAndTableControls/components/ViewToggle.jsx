import { useContext, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'

import theme from '../../../styles/theme'
import { BiggerIconMapOutline, BiggerIconTable } from '../../MetricsPane/SelectedSiteMetrics.styles'
import { ButtonSecondary } from '../../generic'
import { IconTrayDownload } from '../../../assets/dashboardOnlyIcons'
import zoomToFiltered from '../../../assets/zoom_to_filtered.svg'
import { tooltipText } from '../../../constants/language'

import { Tooltip } from '../../generic/Tooltip'
import { formatProjectDataHelper } from '../../../helperFunctions'

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

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

const ZeroSurveysButton = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.color.secondaryBorder};
  border-left: none;
  width: 27rem;
`

const StyledLabel = styled.label`
  cursor: pointer;
`

const ViewToggle = ({ view, setView, handleZoomToFilteredData }) => {
  const {
    checkedProjects,
    displayedProjects,
    selectedOrganizations,
    setShowProjectsWithNoRecords,
    showProjectsWithNoRecords,
    showYourData,
    isAnyActiveFilters,
  } = useContext(FilterProjectsContext)
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const csvLinkRef = useRef()

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

  const handleShowProjectsWithNoRecords = () => {
    setShowProjectsWithNoRecords(!showProjectsWithNoRecords)
  }

  const tableHeaders = [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Date Range', key: 'formattedDateRange' },
    { label: 'Countries', key: 'countries' },
    { label: 'Organizations', key: 'organizations' },
    { label: 'Surveys', key: 'surveyCount' },
    { label: 'Transects', key: 'transects' },
  ]

  const tableContent = displayedProjects
    .map((project) => {
      if (!checkedProjects.includes(project.project_id)) {
        return null
      }
      const { projectName, formattedDateRange, countries, organizations, surveyCount, transects } =
        formatProjectDataHelper(project)
      const formattedTableRowData = {
        projectName,
        formattedDateRange,
        countries,
        organizations,
        recordCount: project.records.length,
        surveyCount,
        transects,
      }
      return formattedTableRowData
    })
    .filter((project) => project)

  const handleDownload = () => {
    csvLinkRef.current.link.click()
  }

  const downloadedFileName = () => {
    const formattedDate = new Date().toISOString().slice(0, 10)
    return `mermaid_projects_${formattedDate}.csv`
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
        <>
          <StyledViewToggleSecondaryButton onClick={handleDownload}>
            <IconTrayDownload />
            <span>Download</span>
          </StyledViewToggleSecondaryButton>
          <StyledCSVLink
            data={tableContent}
            headers={tableHeaders}
            filename={downloadedFileName()}
            ref={csvLinkRef}
          />
          {selectedOrganizations.length || showYourData ? (
            <ZeroSurveysButton onClick={handleShowProjectsWithNoRecords}>
              <input
                type="checkbox"
                id="show-0-projects"
                checked={showProjectsWithNoRecords}
                onChange={handleShowProjectsWithNoRecords}
              />
              <StyledLabel htmlFor="show-0-projects" onClick={(e) => e.stopPropagation()}>
                Show projects with 0 surveys
              </StyledLabel>
            </ZeroSurveysButton>
          ) : null}
        </>
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
