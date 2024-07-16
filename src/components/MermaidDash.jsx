import { useEffect, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import Header from './Header/Header'
import { useAuth0 } from '@auth0/auth0-react'
import LeafletMap from './LeafletMap'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import FilterPane from './FilterPane'
import LoadingIndicator from './LoadingIndicator'
import ViewToggle from './ViewToggle'
import TableView from './TableView'
import { useLocation, useNavigate } from 'react-router-dom'
import MetricsPane from './MetricsPane'
import theme from '../theme'
import { IconFilter } from './icons'
import { ButtonSecondary } from './generic/buttons'
import Modal from './generic/Modal'
import useResponsive from '../library/useResponsive'

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
  ${(props) => props.$showFilterPane && 'width: 50%;'}
  ${mediaQueryTabletLandscapeOnly(css`
    z-index: 400;
    background-color: ${theme.color.grey1};
    overflow-y: scroll;
    width: ${(props) => (props.$showFilterPane ? '80%' : '0%')};
    position: absolute;
    top: 10%;
    height: ${(props) => (props.$showFilterPane ? '80%' : '0%')};
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

export default function MermaidDash() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [projectData, setProjectData] = useState({})
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [showFilterPane, setShowFilterPane] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showMetricsPane, setShowMetricsPane] = useState(true)
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const queryParamsSampleEventId = queryParams.get('sample_event_id')
  const initialSelectedMarker =
    queryParamsSampleEventId !== null
      ? {
          options: {
            sample_event_id: queryParamsSampleEventId,
          },
        }
      : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true)
  const [mermaidUserData, setMermaidUserData] = useState({})
  const { isMobileWidth, isDesktopWidth } = useResponsive()

  const fetchData = async (token) => {
    try {
      let nextPageUrl = `${import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT}?limit=300&page=1`

      while (nextPageUrl !== null) {
        const response = await fetch(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProjectData((prevData) => {
            return {
              ...prevData,
              count: data.count,
              next: data.next,
              previous: data.previous,
              results: prevData.results
                ? [...prevData.results, ...data.results]
                : [...data.results],
            }
          })
          nextPageUrl = data.next
        } else {
          console.error('Failed to fetch data:', response.status)
          break
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getAuthorizationHeaders = async (getAccessTokenSilently) => ({
    headers: {
      Authorization: `Bearer ${await getAccessTokenSilently()}`,
    },
  })

  const fetchUserProfile = async () => {
    try {
      const profileEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/me/`
      const response = await fetch(
        profileEndpoint,
        await getAuthorizationHeaders(getAccessTokenSilently),
      )
      const parsedResponse = await response.json()
      setMermaidUserData(parsedResponse)
    } catch (e) {
      console.error('Error fetching user profile:', e)
    }
  }

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : ''
        fetchData(token)
        if (isAuthenticated) {
          fetchUserProfile()
        }
      } catch (e) {
        console.error('Error fetching data:', e)
      }
    }

    if (isLoading) {
      return
    }
    handleFetchData()
  }, [isLoading, isAuthenticated, getAccessTokenSilently])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get('view') === 'tableView' && isDesktopWidth) {
      setView('tableView')
      return
    }
    setView('mapView')
    queryParams.delete('view')
    updateURLParams(queryParams)
  }, [location.search, updateURLParams])

  useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth) {
        setView('mapView')
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleShowFilterPane = () => {
    setShowFilterPane(!showFilterPane)
  }

  const handleShowFilterModal = () => {
    setShowFilterModal(!showFilterModal)
  }

  const renderFilter = (showFilterModal) => {
    const modalContent = (
      <FilterPane
        projectData={projectData}
        displayedProjects={displayedProjects}
        setDisplayedProjects={setDisplayedProjects}
        setSelectedMarkerId={setSelectedMarkerId}
      />
    )

    const footerContent = (
      <MobileFooterContainer>
        <MobileCloseFilterPaneButton onClick={handleShowFilterModal}>
          Close
        </MobileCloseFilterPaneButton>
      </MobileFooterContainer>
    )

    return isMobileWidth ? (
      <Modal
        isOpen={showFilterModal}
        onDismiss={handleShowFilterModal}
        title=""
        mainContent={modalContent}
        footerContent={footerContent}
        modalCustomWidth={'100vw'}
        modalCustomHeight={'100dvh'}
      />
    ) : (
      <StyledFilterWrapper $showFilterPane={showFilterPane}>
        {showFilterPane ? (
          <StyledFilterContainer>
            <FilterPane
              projectData={projectData}
              displayedProjects={displayedProjects}
              setDisplayedProjects={setDisplayedProjects}
              setSelectedMarkerId={setSelectedMarkerId}
            />
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
        displayedProjects={displayedProjects}
        selectedMarkerId={selectedMarkerId}
        setSelectedMarkerId={setSelectedMarkerId}
        showFilterPane={showFilterPane}
        showMetricsPane={showMetricsPane}
      />
      {isDesktopWidth ? (
        <ViewToggle view={view} setView={setView} displayedProjects={displayedProjects} />
      ) : null}
      <LoadingIndicator
        projectData={projectData}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledMapContainer>
  )

  const renderTable = () => (
    <StyledTableContainer>
      <TableView displayedProjects={displayedProjects} />
      {isDesktopWidth ? (
        <ViewToggle view={view} setView={setView} displayedProjects={displayedProjects} />
      ) : null}
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
        {renderFilter(showFilterModal)}
        {isMobileWidth || view === 'mapView' ? renderMap() : renderTable()}
        {renderMetrics()}
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}
