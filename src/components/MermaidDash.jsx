import { useEffect, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import Header from './Header/Header'
import LeafletMap from './LeafletMap'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import FilterPane from './FilterPane'
import LoadingIndicator from './LoadingIndicator'
import TableView from './TableView'
import { useLocation, useNavigate } from 'react-router-dom'
import MetricsPane from './MetricsPane'
import theme from '../theme'
import { IconFilter } from './icons'
import { ButtonSecondary } from './generic/buttons'
import Modal from './generic/Modal'
import { useFilterProjectsContext } from '../context/FilterProjectsContext'

const StyledDashboardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100dvh;
`

const StyledContentContainer = styled('div')`
  display: flex;
  flex-direction: row;
  margin-top: 4.9rem;
  flex-grow: 1;
`

const StyledFilterWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  position: relative;
  ${(props) => props.showFilterPane === true && 'width: 50%;'}
  ${mediaQueryTabletLandscapeOnly(css`
    z-index: 400;
    background-color: ${theme.color.grey1};
    overflow-y: scroll;
    width: ${(props) => (props.showFilterPane === true ? '80%' : '0%')};
    position: absolute;
    top: 10%;
    height: ${(props) => (props.showFilterPane === true ? '80%' : '0%')};
    left: 50%;
    transform: translateX(-50%);
  `)}
`

const StyledFilterContainer = styled('div')`
  z-index: 2;
  overflow-y: scroll;
  height: calc(100dvh - 5rem);
  width: 100%;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const StyledMapContainer = styled('div')`
  flex-grow: 2;
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  display: grid;
`

const StyledTableContainer = styled('div')`
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  position: relative;
`

const BiggerFilterIcon = styled(IconFilter)`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.3rem;
  position: relative;
`

const DesktopToggleFilterPaneButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  right: -4rem;
  height: 6rem;
  z-index: 5;
  width: 4rem;
  border: none;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

const StyledMobileToggleFilterPaneButton = styled(ButtonSecondary)`
  position: absolute;
  display: none;
  height: 6rem;
  width: 6rem;
  ${mediaQueryTabletLandscapeOnly(css`
    display: block;
    top: calc(${theme.spacing.headerHeight} + 1rem);
    left: 2rem;
    z-index: 5;
  `)};
`

const MobileCloseFilterPaneButton = styled(ButtonSecondary)`
  display: block;
  cursor: pointer;
  width: calc(100% - 2rem);
  margin: 1rem;
`

const MobileFooterContainer = styled('div')`
  background-color: ${theme.color.grey1};
  margin: -1rem;
  padding-left: 2rem;
`

const mobileWidthThreshold = 960

export default function MermaidDash() {
  const { projectData, displayedProjects } = useFilterProjectsContext()
  const [showFilterPane, setShowFilterPane] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showMetricsPane, setShowMetricsPane] = useState(true)
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true)

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get('view') === 'tableView' && window.innerWidth > mobileWidthThreshold) {
      setView('tableView')
      return
    }
    setView('mapView')
    queryParams.delete('view')
    updateURLParams(queryParams)
  }, [location.search, updateURLParams])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= mobileWidthThreshold) {
        setView('mapView')
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleShowFilterPane = () => {
    setShowFilterPane((prevState) => !prevState)
  }

  const handleShowFilterModal = () => {
    setShowFilterModal((prevState) => !prevState)
  }

  const renderFilter = () => {
    const modalContent = <FilterPane />

    const footerContent = (
      <MobileFooterContainer>
        <MobileCloseFilterPaneButton onClick={handleShowFilterModal}>
          Close
        </MobileCloseFilterPaneButton>
      </MobileFooterContainer>
    )

    return window.innerWidth <= mobileWidthThreshold ? (
      <Modal
        isOpen={showFilterModal}
        onDismiss={handleShowFilterModal}
        title=""
        mainContent={modalContent}
        footerContent={footerContent}
        modalCustomWidth={'auto'}
        modalContentCustomHeight={'90dvh'}
        modalOmitTitle={true}
      />
    ) : (
      <StyledFilterWrapper showFilterPane={showFilterPane}>
        {showFilterPane ? (
          <StyledFilterContainer>
            <FilterPane />
          </StyledFilterContainer>
        ) : null}

        <DesktopToggleFilterPaneButton onClick={handleShowFilterPane}>
          {showFilterPane ? String.fromCharCode(10094) : String.fromCharCode(10095)}{' '}
        </DesktopToggleFilterPaneButton>
      </StyledFilterWrapper>
    )
  }

  const renderMap = () => (
    <StyledMapContainer>
      <LeafletMap
        showFilterPane={showFilterPane}
        showMetricsPane={showMetricsPane}
        view={view}
        setView={setView}
        projectDataCount={projectData?.count || 0}
      />
      <LoadingIndicator
        projectData={projectData}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledMapContainer>
  )

  const renderTable = () => (
    <StyledTableContainer>
      <TableView
        displayedProjects={displayedProjects}
        view={view}
        setView={setView}
        projectDataCount={projectData?.count || 0}
      />
      <LoadingIndicator
        projectData={projectData}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledTableContainer>
  )

  const renderMetrics = () => (
    <MetricsPane
      displayedProjects={displayedProjects}
      showMetricsPane={showMetricsPane}
      setShowMetricsPane={setShowMetricsPane}
      showLoadingIndicator={showLoadingIndicator}
    />
  )

  return (
    <StyledDashboardContainer>
      <Header />
      <StyledMobileToggleFilterPaneButton onClick={handleShowFilterModal}>
        <BiggerFilterIcon />
      </StyledMobileToggleFilterPaneButton>
      <StyledContentContainer>
        {renderFilter()}
        {window.innerWidth <= mobileWidthThreshold || view === 'mapView'
          ? renderMap()
          : renderTable()}
        {renderMetrics()}
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}
