import PropTypes from 'prop-types'
import { useRef } from 'react'
import styled from 'styled-components'
import theme from '../theme'
import { ButtonPrimary, ButtonSecondary } from './generic/buttons'
import { IconMapOutline, IconTable } from './dashboardOnlyIcons'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatProjectDataHelper } from '../utils'
import { CSVLink } from 'react-csv'

const StyledViewToggleContainer = styled('div')`
  position: absolute;
  width: 10rem;
  left: ${(props) => (props.view === 'mapView' ? '27%' : '40%')};
  bottom: 1.8rem;
  z-index: 2;
  display: flex;
  flex-direction: row;
  background-color: ${theme.color.grey1};
`

const OpaquePrimaryButton = styled(ButtonPrimary)`
  opacity: 0.3;
`

const OpaqueSecondaryButton = styled(ButtonSecondary)`
  opacity: 0.3;
`

const OpaqueButtonPrimaryWithMargin = styled(OpaquePrimaryButton)`
  margin-left: 0.1rem;
`

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

export default function ViewToggle(props) {
  const { view, setView, displayedProjects } = props
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
          <OpaqueSecondaryButton onClick={handleMapView}>
            <IconMapOutline />
            <div>Map</div>
          </OpaqueSecondaryButton>
          <OpaquePrimaryButton onClick={handleTableView}>
            <IconTable />
            <div>Table</div>
          </OpaquePrimaryButton>
          <OpaqueButtonPrimaryWithMargin onClick={handleDownload}>
            DOWNLOAD
          </OpaqueButtonPrimaryWithMargin>
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
  displayedProjects: PropTypes.array.isRequired,
}
