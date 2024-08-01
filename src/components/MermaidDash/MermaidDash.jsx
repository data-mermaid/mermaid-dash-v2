import { useEffect, useState, useCallback } from 'react'
import Header from '../Header/Header'
import LeafletMap from '../LeafletMap'
import FilterPane from '../FilterPane/FilterPane'
import LoadingIndicator from './components/LoadingIndicator'
import TableView from '../TableView/TableView'
import { useLocation, useNavigate } from 'react-router-dom'
import MetricsPane from '../MetricsPane/MetricsPane'
import { Modal } from '../generic'
import { useFilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'
import { useAuth0 } from '@auth0/auth0-react'
import {
  StyledDashboardContainer,
  StyledContentContainer,
  StyledFilterWrapper,
  StyledFilterContainer,
  StyledMapContainer,
  StyledTableContainer,
  BiggerFilterIcon,
  DesktopToggleFilterPaneButton,
  StyledMobileToggleFilterPaneButton,
  MobileCloseFilterPaneButton,
  MobileFooterContainer,
} from './MermaidDash.styles'

const MermaidDash = () => {
  const {
    projectData,
    displayedProjects,
    setProjectData,
    mermaidUserData,
    setMermaidUserData,
    setCheckedProjects,
  } = useFilterProjectsContext()
  const [showFilterPane, setShowFilterPane] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showMetricsPane, setShowMetricsPane] = useState(true)
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true)
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

  const getAuthorizationHeaders = async (getAccessTokenSilently) => ({
    headers: {
      Authorization: `Bearer ${await getAccessTokenSilently()}`,
    },
  })

  const fetchData = useCallback(
    async (token = '') => {
      try {
        const apiEndpoint = import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT
        const initialUrl = `${apiEndpoint}?limit=300&page=1`
        let nextPageUrl = initialUrl

        while (nextPageUrl) {
          const response = await fetch(nextPageUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            console.error('Failed to fetch data:', response.status)
            break
          }

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
          setCheckedProjects((prevCheckedProjects) => [
            ...prevCheckedProjects,
            ...data.results.map((project) => project.project_id),
          ])
          nextPageUrl = data.next
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    [setProjectData, setCheckedProjects],
  )

  const fetchUserProfile = useCallback(async () => {
    try {
      const profileEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/me/`
      const headers = await getAuthorizationHeaders(getAccessTokenSilently)
      const response = await fetch(profileEndpoint, headers)
      const parsedResponse = await response.json()
      setMermaidUserData(parsedResponse)
    } catch (e) {
      console.error('Error fetching user profile:', e)
    }
  }, [getAccessTokenSilently, setMermaidUserData])

  const _fetchDataFromApi = useEffect(() => {
    const handleFetchData = async () => {
      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : ''
        fetchData(token)
        if (isAuthenticated) {
          fetchUserProfile()
          const profileEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/me/`
          const response = await fetch(
            profileEndpoint,
            await getAuthorizationHeaders(getAccessTokenSilently),
          )
          const parsedResponse = await response.json()
          setMermaidUserData(parsedResponse)
        }
      } catch (e) {
        console.error('Error fetching data:', e)
      }
    }

    if (isLoading) {
      return
    }
    handleFetchData()
  }, [
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    fetchUserProfile,
    fetchData,
    setMermaidUserData,
  ])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const _setViewWhenAppLoads = useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get('view') === 'tableView' && isDesktopWidth) {
      setView('tableView')
      return
    }
    setView('mapView')
    queryParams.delete('view')
    updateURLParams(queryParams)
  }, [location.search, updateURLParams, isDesktopWidth])

  const _switchToMapViewIfResizedToMobileWidth = useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth) {
        setView('mapView')
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileWidth])

  const handleShowFilterPane = () => {
    setShowFilterPane(!showFilterPane)
  }

  const handleShowFilterModal = () => {
    setShowFilterModal(!showFilterModal)
  }

  const renderFilter = () => {
    const modalContent = <FilterPane mermaidUserData={mermaidUserData} />

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
            <FilterPane mermaidUserData={mermaidUserData} />
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
      <TableView view={view} setView={setView} />
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

export default MermaidDash
