import { useEffect, useState, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'

import Header from '../Header/Header'
import FilterPane from '../FilterPane/FilterPane'
import LoadingIndicator from './components/LoadingIndicator'
import TableView from '../TableView/TableView'
import { useLocation, useNavigate } from 'react-router-dom'
import MetricsPane from '../MetricsPane/MetricsPane'
import { Modal } from '../generic'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
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
  StyledChevronSpan,
} from './MermaidDash.styles'
import MaplibreMap from '../MaplibreMap'

const MermaidDash = ({ isApiDataLoaded, setIsApiDataLoaded }) => {
  const { projectData, setProjectData, mermaidUserData, setMermaidUserData, setCheckedProjects } =
    useContext(FilterProjectsContext)
  const [showFilterPane, setShowFilterPane] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showMetricsPane, setShowMetricsPane] = useState(true)
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [loadedProjectsCount, setLoadedProjectCount] = useState(0)
  const [totalProjectsCount, setTotalProjectsCount] = useState(0)
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(!isApiDataLoaded)

  const getAuthorizationHeaders = async (getAccessTokenSilently) => ({
    headers: {
      Authorization: `Bearer ${await getAccessTokenSilently()}`,
    },
  })

  const fetchData = useCallback(
    async (token = '') => {
      if (isApiDataLoaded) {
        return
      }
      try {
        setLoadedProjectCount(0)
        setTotalProjectsCount(0)
        const apiEndpoint = import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT
        const initialUrl = `${apiEndpoint}?limit=300&page=1`
        let nextPageUrl = initialUrl
        let newApiData = { results: [] }
        let newCheckedProjects = []

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
          if (!data.results) {
            return
          }
          const resultsProjectIds = data.results.map((project) => project.project_id)

          newApiData = {
            ...newApiData,
            count: data.count,
            results: [...newApiData.results, ...data.results],
          }
          newCheckedProjects = [...newCheckedProjects, ...resultsProjectIds]
          setLoadedProjectCount((prevCount) => prevCount + data.results.length)
          setTotalProjectsCount(data.count)
          nextPageUrl = data.next
        }

        setProjectData(newApiData)
        setCheckedProjects(newCheckedProjects)
        setIsApiDataLoaded(true) // ensures we dont accidentally refetch data. Tends to happen with dev server hot reloading.
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    [isApiDataLoaded, setProjectData, setCheckedProjects, setIsApiDataLoaded],
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
          {showFilterPane ? (
            <>
              <StyledChevronSpan>{String.fromCharCode(10094)}</StyledChevronSpan>
            </>
          ) : (
            <>
              <StyledChevronSpan>{String.fromCharCode(10095)}</StyledChevronSpan>
            </>
          )}
          <span>Filters</span>
        </DesktopToggleFilterPaneButton>
      </StyledFilterWrapper>
    )
  }

  const map = (
    <StyledMapContainer>
      <MaplibreMap
        showFilterPane={showFilterPane}
        showMetricsPane={showMetricsPane}
        view={view}
        setView={setView}
        projectDataCount={projectData?.count || 0}
      />
      <LoadingIndicator
        currentProgress={loadedProjectsCount}
        finalProgress={totalProjectsCount}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledMapContainer>
  )

  const table = (
    <StyledTableContainer>
      <TableView view={view} setView={setView} mermaidUserData={mermaidUserData} />
      <LoadingIndicator
        currentProgress={loadedProjectsCount}
        finalProgress={totalProjectsCount}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledTableContainer>
  )

  const renderMetrics = () => (
    <MetricsPane
      showMetricsPane={showMetricsPane}
      setShowMetricsPane={setShowMetricsPane}
      view={view}
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
        {isMobileWidth || view === 'mapView' ? map : table}
        {renderMetrics()}
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}

MermaidDash.propTypes = {
  isApiDataLoaded: PropTypes.bool,
  setIsApiDataLoaded: PropTypes.func,
}
export default MermaidDash
