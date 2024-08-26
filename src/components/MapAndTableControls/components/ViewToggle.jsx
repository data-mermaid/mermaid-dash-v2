import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../../generic'
import { IconMapOutline, IconTable, IconTrayDownload } from '../../../assets/dashboardOnlyIcons'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatProjectDataHelper } from '../../../helperFunctions'
import { CSVLink } from 'react-csv'
import { useFilterProjectsContext } from '../../../context/FilterProjectsContext'

const StyledViewToggleContainer = styled.div`
  width: 12.5rem;
  left: 5rem;
  top: 1.3rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
`

const ButtonSecondaryWithMargin = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
`

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

const ViewToggle = ({ view, setView }) => {
  const { displayedProjects, checkedProjects } = useFilterProjectsContext()
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
      {view === 'mapView' ? (
        <>
          <ButtonPrimary onClick={handleMapView}>
            <IconMapOutline />
            Map
          </ButtonPrimary>
          <ButtonSecondary onClick={handleTableView}>
            <IconTable />
            Table
          </ButtonSecondary>
        </>
      ) : (
        <>
          <ButtonSecondary onClick={handleMapView}>
            <IconMapOutline />
            <div>Map</div>
          </ButtonSecondary>
          <ButtonPrimary onClick={handleTableView}>
            <IconTable />
            <div>Table</div>
          </ButtonPrimary>
          <ButtonSecondaryWithMargin onClick={handleDownload}>
            <IconTrayDownload />
            <span>Download</span>
          </ButtonSecondaryWithMargin>
          <StyledCSVLink
            data={tableContent}
            headers={tableHeaders}
            filename={downloadedFileName()}
            ref={csvLinkRef}
          />
        </>
      )}
    </StyledViewToggleContainer>
  )
}

ViewToggle.propTypes = {
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
}

export default ViewToggle
