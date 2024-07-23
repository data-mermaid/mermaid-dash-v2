import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../../generic'
import { IconMapOutline, IconTable, IconTrayDownload } from '../../../assets/dashboardOnlyIcons'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatProjectDataHelper } from '../../../helperFunctions'
import { CSVLink } from 'react-csv'
import { useFilterProjectsContext } from '../../../context/FilterProjectsContext'

const StyledViewToggleContainer = styled('div')`
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
  const { displayedProjects } = useFilterProjectsContext()
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
    { label: 'Years', key: 'formattedYears' },
    { label: 'Countries', key: 'countries' },
    { label: 'Organizations', key: 'organizations' },
    { label: 'Transects', key: 'transects' },
    { label: 'Sites', key: 'siteCount' },
  ]

  const tableContent = displayedProjects.map((project) => {
    const { projectName, formattedYears, countries, organizations, siteCount } =
      formatProjectDataHelper(project)
    const formattedTableRowData = {
      projectName,
      formattedYears,
      countries,
      organizations,
      recordCount: project.records.length,
      siteCount,
    }
    return formattedTableRowData
  })

  const handleDownload = () => {
    csvLinkRef.current.link.click()
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
            filename="project_data.csv"
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
