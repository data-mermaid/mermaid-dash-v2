import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../theme'
import { ButtonPrimary, ButtonSecondary } from './generic/buttons'
import { IconMapOutline, IconTable } from './icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatProjectDataHelper } from '../utils'

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
export default function ViewToggle(props) {
  const { view, setView, displayedProjects, tableHeaders } = props
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

  const downloadTableData = () => {
    const tableContent = displayedProjects.map((project) => {
      const { projectName, formattedYears, countries, organizations, siteCount } =
        formatProjectDataHelper(project)
      return `"${projectName}","${formattedYears}","${countries}","${organizations}",${project.records.length},${siteCount}`
    })

    const csvContent =
      'data:text/csv;charset=utf-8,' + [tableHeaders.join(','), ...tableContent].join('\n')

    const link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', 'table_data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <OpaqueButtonPrimaryWithMargin onClick={downloadTableData}>
            DOWNLOAD
          </OpaqueButtonPrimaryWithMargin>
        </>
      )}
    </StyledViewToggleContainer>
  )
}

ViewToggle.propTypes = {
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  setView: PropTypes.func.isRequired,
  displayedProjects: PropTypes.array.isRequired,
  tableHeaders: PropTypes.array,
}
