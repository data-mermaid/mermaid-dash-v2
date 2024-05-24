import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../theme'
import { ButtonPrimary, ButtonSecondary } from './generic/buttons'
import { IconMapOutline, IconTable } from './icons'
import { useLocation, useNavigate } from 'react-router-dom'

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
export default function ViewToggle(props) {
  const { view, setView } = props
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
        </>
      )}
    </StyledViewToggleContainer>
  )
}

ViewToggle.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
}
