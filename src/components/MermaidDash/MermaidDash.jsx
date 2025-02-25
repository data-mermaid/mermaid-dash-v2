import { useEffect, useState, useCallback, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import bbox from '@turf/bbox'
import { points } from '@turf/helpers'
import { toast } from 'react-toastify'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

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
  StyledMobileZoomToDataButton,
  StyledMobileFollowMapButton,
  FilterDownloadWrapper,
  FilterDownloadButton,
  DownloadMenu,
  GFCRDataDownloadButton,
} from './MermaidDash.styles'
import zoomToFiltered from '../../assets/zoom_to_filtered.svg'
import zoomToMap from '../../assets/zoom-map.svg'
import loginOnlyIcon from '../../assets/login-only-icon.svg'
import { IconCaretUp, IconTrayDownload } from '../../assets/dashboardOnlyIcons'
import { ARROW_LEFT, ARROW_RIGHT } from '../../assets/arrowIcons'
import { toastMessageText, tooltipText } from '../../constants/language'

import { MuiTooltip } from '../generic/MuiTooltip'
import { ButtonPrimary, Modal } from '../generic'
import Header from '../Header/Header'
import FilterPane from '../FilterPane/FilterPane'
import TableView from '../TableView/TableView'
import MetricsPane from '../MetricsPane/MetricsPane'
import MaplibreMap from '../MaplibreMap'
import HideShow from '../Header/components/HideShow'
import LoadingIndicator from './components/LoadingIndicator'
import useLocalStorage from '../../hooks/useLocalStorage'
import DownloadModal from './components/DownloadModal'
import DownloadGFCRModal from './components/DownloadGFCRModal'

const getSurveyedMethodBasedOnSurveyCount = (surveyCount) => {
  const customSortOrder = [
    'colonies_bleached',
    'benthicpit',
    'benthiclit',
    'benthicpqt',
    'habitatcomplexity',
    'quadrat_benthic_percent',
  ]

  if (surveyCount.beltfish > 0) {
    return 'beltfish'
  }

  return (
    Object.entries(surveyCount)
      .filter(([, value]) => value > 0)
      .sort((a, b) => customSortOrder.indexOf(a[0]) - customSortOrder.indexOf(b[0]))
      .map(([key]) => key)[0] || 'beltfish'
  )
}

const MermaidDash = ({ isApiDataLoaded, setIsApiDataLoaded }) => {
  const {
    projectData,
    setProjectData,
    mermaidUserData,
    enableFollowScreen,
    setMermaidUserData,
    setCheckedProjects,
    displayedProjects,
    getURLParams,
    setEnableFollowScreen,
    allProjectsFinishedFiltering,
    filteredSurveys,
  } = useContext(FilterProjectsContext)

  const [isFilterPaneShowing, setIsFilterPaneShowing] = useLocalStorage('isFilterPaneShowing', true)
  const [isFilterModalShowing, setIsFilterModalShowing] = useState(false)
  const [isMetricsPaneShowing, setIsMetricsPaneShowing] = useState(true)
  const [isDownloadModalShowing, setIsDownloadModalShowing] = useState(false)
  const [isDownloadGFCRModalShowing, setIsDownloadGFCRModalShowing] = useState(false)
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const { isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(!isApiDataLoaded)
  const [selectedMethod, setSelectedMethod] = useState('')

  const mapRef = useRef()

  const surveyedMethodCount = filteredSurveys.reduce((acc, record) => {
    const protocols = record.protocols || {}

    Object.keys(protocols).map((protocol) => {
      if (acc[protocol]) {
        acc[protocol] += 1
      } else {
        acc[protocol] = 1
      }
    })

    return acc
  }, {})

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
          setProjectData(newApiData)
          setCheckedProjects(newCheckedProjects)

          nextPageUrl = data.next
        }

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
    const handleFetchDataFromApi = async () => {
      if (isLoading) {
        return
      }

      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : ''
        await fetchData(token)
        await fetchUserProfile()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    handleFetchDataFromApi()
  }, [isLoading, isAuthenticated, getAccessTokenSilently, fetchData, fetchUserProfile])

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
    setIsFilterPaneShowing(!isFilterPaneShowing)
  }

  const handleShowFilterModal = () => {
    setIsFilterModalShowing(!isFilterModalShowing)
  }

  const handleShowDownloadModal = () => {
    setSelectedMethod(getSurveyedMethodBasedOnSurveyCount(surveyedMethodCount))
    setIsDownloadModalShowing(true)
  }

  const handleShowDownloadGFCRModal = () => {
    setIsDownloadGFCRModalShowing(true)
  }

  const handleZoomToFilteredData = () => {
    const map = mapRef.current.getMap()

    if (!map || !displayedProjects || displayedProjects.length === 0) {
      return
    }

    const normalizeLongitudeWithinRange = (lon) => {
      return (lon + 360) % 360
    }

    const coordinates = displayedProjects.flatMap((project) =>
      project.records.map((record) => {
        const newLon = normalizeLongitudeWithinRange(record.longitude)
        return [newLon, record.latitude]
      }),
    )

    if (coordinates.length === 0) {
      return
    }

    const bounds = bbox(points(coordinates))
    map.fitBounds(bounds, { maxZoom: 17, padding: 20 })
  }

  const handleFollowScreen = () => {
    setEnableFollowScreen((prevState) => !prevState)

    const newState = !enableFollowScreen
    const queryParams = getURLParams()
    const followScreenToastMessage = enableFollowScreen
      ? toastMessageText.followMapDisabled
      : toastMessageText.followMapEnabled

    if (newState) {
      queryParams.set('follow_screen', 'true')
    } else {
      queryParams.delete('follow_screen')
    }

    updateURLParams(queryParams)
    toast.info(followScreenToastMessage)
  }

  const handleSelectedMethodChange = (e) => setSelectedMethod(e.target.value)

  const handleLogin = () => {
    loginWithRedirect({ appState: { returnTo: location.search } })
  }

  const renderOverflowDownloadMenu = () => {
    return (
      <DownloadMenu>
        <ButtonPrimary onClick={handleShowDownloadGFCRModal}>
          <IconTrayDownload /> Download GFCR Data
        </ButtonPrimary>
      </DownloadMenu>
    )
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
        isOpen={isFilterModalShowing}
        onDismiss={handleShowFilterModal}
        title=""
        mainContent={modalContent}
        footerContent={footerContent}
        modalCustomWidth={'100vw'}
        modalCustomHeight={'100dvh'}
      />
    ) : (
      <StyledFilterWrapper $isFilterPaneShowing={isFilterPaneShowing}>
        {isFilterPaneShowing ? (
          <StyledFilterContainer>
            <FilterPane mermaidUserData={mermaidUserData} />
          </StyledFilterContainer>
        ) : null}

        <DesktopToggleFilterPaneButton onClick={handleShowFilterPane}>
          <MuiTooltip
            title={isFilterPaneShowing ? tooltipText.hideFilters : tooltipText.showFilters}
          >
            <StyledChevronSpan>{isFilterPaneShowing ? ARROW_LEFT : ARROW_RIGHT}</StyledChevronSpan>
          </MuiTooltip>
        </DesktopToggleFilterPaneButton>
        {isFilterPaneShowing ? (
          <FilterDownloadWrapper>
            <FilterDownloadButton
              disabled={!allProjectsFinishedFiltering}
              $isAuthenticated={isAuthenticated}
              onClick={isAuthenticated ? handleShowDownloadModal : handleLogin}
            >
              {isAuthenticated ? (
                <>
                  <IconTrayDownload /> <span>Download</span>
                </>
              ) : (
                <>
                  <img src={loginOnlyIcon} alt="Login required" /> <span>Log in to download</span>
                </>
              )}
            </FilterDownloadButton>
            {isAuthenticated && (
              <HideShow
                button={
                  <GFCRDataDownloadButton disabled={!allProjectsFinishedFiltering}>
                    <IconCaretUp />
                  </GFCRDataDownloadButton>
                }
                contents={renderOverflowDownloadMenu()}
              />
            )}
          </FilterDownloadWrapper>
        ) : null}
        <DownloadModal
          isOpen={isDownloadModalShowing}
          onDismiss={() => setIsDownloadModalShowing(false)}
          selectedMethod={selectedMethod}
          handleSelectedMethodChange={handleSelectedMethodChange}
        />
        <DownloadGFCRModal
          isOpen={isDownloadGFCRModalShowing}
          onDismiss={() => setIsDownloadGFCRModalShowing(false)}
        />
      </StyledFilterWrapper>
    )
  }

  const map = (
    <StyledMapContainer>
      <MaplibreMap
        mapRef={mapRef}
        isFilterPaneShowing={isFilterPaneShowing}
        isMetricsPaneShowing={isMetricsPaneShowing}
        view={view}
        setView={setView}
        projectDataCount={projectData?.count || 0}
      />
      {isMobileWidth ? null : (
        <LoadingIndicator
          currentProgress={projectData?.results?.length || 0}
          finalProgress={projectData?.count || 0}
          showLoadingIndicator={showLoadingIndicator}
          setShowLoadingIndicator={setShowLoadingIndicator}
          isRelativelyPositioned={false}
        />
      )}
    </StyledMapContainer>
  )

  const table = (
    <StyledTableContainer>
      <TableView view={view} setView={setView} mermaidUserData={mermaidUserData} />
      <LoadingIndicator
        currentProgress={projectData?.results?.length || 0}
        finalProgress={projectData?.count || 0}
        showLoadingIndicator={showLoadingIndicator}
        setShowLoadingIndicator={setShowLoadingIndicator}
      />
    </StyledTableContainer>
  )

  return (
    <StyledDashboardContainer>
      <Header />
      <StyledMobileToggleFilterPaneButton onClick={handleShowFilterModal}>
        <BiggerFilterIcon />
      </StyledMobileToggleFilterPaneButton>
      <StyledMobileZoomToDataButton onClick={handleZoomToFilteredData}>
        <img src={zoomToFiltered} />
      </StyledMobileZoomToDataButton>
      <StyledMobileFollowMapButton
        enableFollowScreen={enableFollowScreen}
        onClick={handleFollowScreen}
      >
        <img src={zoomToMap} />
      </StyledMobileFollowMapButton>
      <StyledContentContainer>
        {renderFilter(isFilterModalShowing)}
        {isMobileWidth || view === 'mapView' ? map : table}
        <MetricsPane
          isMetricsPaneShowing={isMetricsPaneShowing}
          setIsMetricsPaneShowing={setIsMetricsPaneShowing}
          view={view}
          showLoadingIndicator={showLoadingIndicator}
          setShowLoadingIndicator={setShowLoadingIndicator}
        />
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}

MermaidDash.propTypes = {
  isApiDataLoaded: PropTypes.bool,
  setIsApiDataLoaded: PropTypes.func,
}
export default MermaidDash
