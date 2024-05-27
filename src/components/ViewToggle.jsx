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
  left: 27%;
  bottom: 1.5rem;
  z-index: 2;
  display: flex;
  flex-direction: row;
  background-color: ${theme.color.grey1};
`

const ButtonPrimaryWithMargin = styled(ButtonPrimary)`
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
    <StyledViewToggleContainer>
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
            Map
          </ButtonSecondary>
          <ButtonPrimary onClick={handleTableView}>
            <IconTable />
            Table
          </ButtonPrimary>
          <ButtonPrimaryWithMargin onClick={downloadTableData}>DOWNLOAD</ButtonPrimaryWithMargin>
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
