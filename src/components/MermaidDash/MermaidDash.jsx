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
  StyledMobileFilterPill,
  StyledMobileFollowMapButton,
  FilterDownloadWrapper,
  FilterDownloadButton,
  DownloadMenu,
  DownloadMenuButton,
  ExpressDownloadMenu,
  ExpressDownloadMenuItem,
  ExpressDownloadMenuHeaderItem,
  MediumIconUp,
  MediumIconDown,
} from './MermaidDash.styles'
import zoomToFiltered from '../../assets/zoom_to_filtered.svg'
import zoomToMap from '../../assets/zoom-map.svg'
import loginOnlyIcon from '../../assets/login-only-icon.svg'
import { IconTrayDownload } from '../../assets/dashboardOnlyIcons'
import { IconFilter } from '../../assets/icons'
import { ARROW_LEFT, ARROW_RIGHT } from '../../assets/arrowIcons'
import { toastMessageText, tooltipText } from '../../constants/language'
import { DOWNLOAD_METHODS, URL_PARAMS } from '../../constants/constants'

import { MuiTooltip } from '../generic/MuiTooltip'
import { Modal } from '../generic'
import Header from '../Header/Header'
import FilterPane from '../FilterPane/FilterPane'
import TableView from '../TableView/TableView'
import MetricsPane from '../MetricsPane/MetricsPane'
import MaplibreMap from '../MaplibreMap'
import HideShow from '../Header/components/HideShow'
import useLocalStorage from '../../hooks/useLocalStorage'
import DownloadModal from './components/DownloadModal'
import DownloadGFCRModal from './components/DownloadGFCRModal'
import ErrorFetchingModal from './components/ErrorFetchingModal'
import FilterIndicatorPill from '../generic/FilterIndicatorPill'
import SuccessExportModal from './components/SuccessExportModal'

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
    displayedProjects,
    getURLParams,
    setEnableFollowScreen,
    allProjectsFinishedFiltering,
    filteredSurveys,
    getActiveProjectCount,
    clearAllFilters,
    isAnyActiveFilters,
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
  const [isErrorModalShowing, setIsErrorModalShowing] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [isSuccessExportModalOpen, setIsSuccessExportModalOpen] = useState(false)

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

        while (nextPageUrl) {
          const response = await fetch(nextPageUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch data - ${response.status}`)
          }

          const data = await response.json()

          if (!data.results) {
            throw new Error(`Failed to fetch data - data is empty`)
          }

          newApiData = {
            ...newApiData,
            count: data.count,
            results: [...newApiData.results, ...data.results],
          }
          setProjectData(newApiData)

          nextPageUrl = data.next
        }

        setIsApiDataLoaded(true) // ensures we dont accidentally refetch data. Tends to happen with dev server hot reloading.
      } catch (error) {
        console.error(error)
        setIsErrorModalShowing(true)
      }
    },
    [isApiDataLoaded, setProjectData, setIsApiDataLoaded],
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
    if (queryParams.get(URL_PARAMS.VIEW) === 'tableView' && isDesktopWidth) {
      setView('tableView')
      return
    }
    setView('mapView')
    queryParams.delete(URL_PARAMS.VIEW)
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
    const newSelectedMethod = getSurveyedMethodBasedOnSurveyCount(surveyedMethodCount)

    setSelectedMethod(newSelectedMethod)
    setIsDownloadModalShowing(true)
  }

  const handleExpressExport = () => {
    setIsSuccessExportModalOpen(true)
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
      queryParams.set(URL_PARAMS.FOLLOW_SCREEN, 'true')
    } else {
      queryParams.delete(URL_PARAMS.FOLLOW_SCREEN)
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
        <ExpressDownloadMenu>
          <ExpressDownloadMenuHeaderItem>
            <div>Method</div>
            <div>Number of Surveys</div>
          </ExpressDownloadMenuHeaderItem>
          {Object.entries(DOWNLOAD_METHODS).map(([key, method]) => {
            const count = surveyedMethodCount[key] ?? 0

            return (
              <ExpressDownloadMenuItem
                key={key}
                onClick={handleExpressExport}
                disabled={count === 0}
              >
                <div>{method.description}</div>
                <div>{count}</div>
              </ExpressDownloadMenuItem>
            )
          })}
        </ExpressDownloadMenu>
        <DownloadMenuButton onClick={handleShowDownloadModal} role="button">
          Advance Export...
        </DownloadMenuButton>
        <DownloadMenuButton onClick={handleShowDownloadGFCRModal} role="button">
          GFCR Data
        </DownloadMenuButton>
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
            {isFilterPaneShowing ? (
              <StyledChevronSpan>
                {ARROW_LEFT} <IconFilter />
              </StyledChevronSpan>
            ) : (
              <StyledChevronSpan>
                <IconFilter /> {ARROW_RIGHT}
              </StyledChevronSpan>
            )}
          </MuiTooltip>
        </DesktopToggleFilterPaneButton>
        {isFilterPaneShowing ? (
          <FilterDownloadWrapper>
            {isAuthenticated ? (
              <HideShow
                button={
                  <FilterDownloadButton
                    disabled={!allProjectsFinishedFiltering}
                    $isAuthenticated={isAuthenticated}
                  >
                    <IconTrayDownload /> <span>Export data</span>
                    {isExportMenuOpen ? <MediumIconDown /> : <MediumIconUp />}
                  </FilterDownloadButton>
                }
                contents={renderOverflowDownloadMenu()}
                customStyleProps={{ width: '100%' }}
                onToggle={setIsExportMenuOpen}
              />
            ) : (
              <FilterDownloadButton
                disabled={!allProjectsFinishedFiltering}
                $isAuthenticated={isAuthenticated}
                onClick={handleLogin}
              >
                <img src={loginOnlyIcon} alt="Login required" /> <span>Log in to download</span>
              </FilterDownloadButton>
            )}
          </FilterDownloadWrapper>
        ) : null}
        <DownloadModal
          isOpen={isDownloadModalShowing}
          onDismiss={() => setIsDownloadModalShowing(false)}
          surveyedMethodCount={surveyedMethodCount}
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
        projectDataCount={projectData?.count ?? 0}
      />
    </StyledMapContainer>
  )

  const table = (
    <StyledTableContainer>
      <TableView view={view} setView={setView} mermaidUserData={mermaidUserData} />
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
      {isAnyActiveFilters() && getActiveProjectCount() < projectData?.count && (
        <StyledMobileFilterPill>
          <FilterIndicatorPill
            searchFilteredRowLength={getActiveProjectCount()}
            unfilteredRowLength={projectData?.count ?? 0}
            clearFilters={clearAllFilters}
          />
        </StyledMobileFilterPill>
      )}
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
      <ErrorFetchingModal
        isOpen={isErrorModalShowing}
        onDismiss={() => setIsErrorModalShowing(false)}
      />
      <SuccessExportModal
        isOpen={isSuccessExportModalOpen}
        onDismiss={() => setIsSuccessExportModalOpen(false)}
      />
    </StyledDashboardContainer>
  )
}

MermaidDash.propTypes = {
  isApiDataLoaded: PropTypes.bool,
  setIsApiDataLoaded: PropTypes.func,
}
export default MermaidDash
