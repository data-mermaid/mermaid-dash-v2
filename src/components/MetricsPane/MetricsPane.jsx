import { useEffect, useState, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import useResponsive from '../../hooks/useResponsive'
import {
  StyledMetricsWrapper,
  SummarizedMetrics,
  MetricsCard,
  MultipleMetricCardsRow,
  MobileExpandedMetricsPane,
  DesktopToggleMetricsPaneButton,
  MobileExpandMetricsPaneButton,
  BiggerIconCaretDown,
  BiggerIconCaretUp,
  SelectedSiteMetricsCardContainer,
  SelectedSiteSiteCardContainer,
  SelectedSiteContentContainer,
  BiggerIconPersonCircle,
  StyledHeader,
  StyledSummaryMetadataContainer,
  StyledMetricsSelector,
  BiggerIconTextBoxMultiple,
  BiggerIconCalendar,
  BiggerIconUser,
  BiggerIconGlobe,
  BiggerIconText,
  StyledSvgContainer,
  StyledMapPinContainer,
  StyledReefContainer,
  StyledReefRow,
  StyledReefItem,
  StyledReefItemBold,
  StyledVisibleBackground,
  StyledChevronSpan,
  DesktopFollowScreenButton,
  StyledLabel,
  SelectedSiteActionBar,
  MetricCardH3,
  MetricCardPBig,
  MetricCardPMedium,
  InlineOnDesktopMetricWrapper,
} from './MetricsPane.styles'
import { ButtonSecondary } from '../generic'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { IconClose } from '../../assets/icons'
import mapPin from '../../assets/map-pin.png'
import coralReefSvg from '../../assets/coral_reef.svg'
import { IconPersonCircle } from '../../assets/dashboardOnlyIcons'
import ZoomToSiteIcon from '../../assets/zoom_to_selected_sites.svg?react'
import { getIsSiteSelected, zoomToSelectedSite } from '../../helperFunctions/selectedSite'
import { useMap } from 'react-map-gl'
import { MAIN_MAP_ID } from '../../constants/constants'

const MetricsPane = ({ showMetricsPane, setShowMetricsPane, view, showLoadingIndicator }) => {
  const [numSurveys, setNumSurveys] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const {
    checkedProjects,
    displayedProjects,
    enableFollowScreen,
    getActiveProjectCount,
    getURLParams,
    mermaidUserData,
    selectedMarkerId,
    setEnableFollowScreen,
    setSelectedMarkerId,
    updateURLParams,
    userIsMemberOfProject,
  } = useContext(FilterProjectsContext)
  const [selectedSampleEvent, setSelectedSampleEvent] = useState(null)
  const [metricsView, setMetricsView] = useState('summary')
  const isMapView = view === 'mapView'
  const map = useMap()[MAIN_MAP_ID] // the docs for react-map-gl are not clear on the return object for useMap. This is what works in testing. Further, its not a 'ref' its the actual map instance.

  const calculateMetrics = useMemo(() => {
    let surveys = 0
    let transects = 0
    let countries = new Set()
    let years = new Set()

    displayedProjects.forEach((project) => {
      if (!checkedProjects.includes(project.project_id)) {
        return
      }
      project.records.forEach((record) => {
        Object.values(record.protocols).forEach((value) => {
          transects += value.sample_unit_count
        })
        countries.add(record.country_name)
        years.add(record.sample_date.split('-')[0])
      })
      surveys += project.records.length
    })

    const sortedYears = Array.from(years).sort()
    const yearRange =
      sortedYears.length === 0 ? (
        <InlineOnDesktopMetricWrapper>No data to obtain year range</InlineOnDesktopMetricWrapper>
      ) : sortedYears.length === 1 ? (
        <InlineOnDesktopMetricWrapper>
          <MetricCardH3>Year</MetricCardH3> <span>{sortedYears[0]}</span>
        </InlineOnDesktopMetricWrapper>
      ) : (
        <InlineOnDesktopMetricWrapper>
          <MetricCardH3>Years</MetricCardH3>{' '}
          <span>
            {sortedYears[0]} - {sortedYears[sortedYears.length - 1]}
          </span>
        </InlineOnDesktopMetricWrapper>
      )

    return {
      numSurveys: surveys,
      numTransects: transects,
      numUniqueCountries: countries.size,
      yearRange,
    }
  }, [displayedProjects, checkedProjects])

  const _setMetricsAfterCalculating = useEffect(() => {
    const { numSurveys, numTransects, numUniqueCountries } = calculateMetrics
    setNumSurveys(numSurveys)
    setNumTransects(numTransects)
    setNumUniqueCountries(numUniqueCountries)
  }, [calculateMetrics])

  const _getSelectedSampleEvent = useEffect(() => {
    if (!selectedMarkerId || !displayedProjects.length) {
      return
    }

    const foundSelectedSampleEvent = displayedProjects
      .map((project) =>
        project.records.find((record) => record.sample_event_id === selectedMarkerId),
      )
      .find((record) => record !== undefined)

    setSelectedSampleEvent(foundSelectedSampleEvent)
  }, [selectedMarkerId, displayedProjects])

  const handleShowMetricsPane = () => {
    setShowMetricsPane((prevState) => !prevState)
  }

  const handleShowMobileExpandedMetricsPane = () => {
    setShowMobileExpandedMetricsPane((prevState) => !prevState)
  }

  const toggleMobileMetricsPane = () => {
    handleShowMobileExpandedMetricsPane()
  }

  const handleClearSelectedSampleEvent = () => {
    setSelectedSampleEvent(null)
    setSelectedMarkerId(null)
    const queryParams = getURLParams()
    queryParams.delete('sample_event_id')
    updateURLParams(queryParams)
  }

  const handleChangeMetricsView = (event) => {
    setMetricsView(event.target.name)
  }

  const SelectedSiteHeader = () => (
    <StyledVisibleBackground>
      <SelectedSiteSiteCardContainer>
        <StyledMapPinContainer>
          <img src={mapPin} alt="map-pin" />
        </StyledMapPinContainer>
        <StyledHeader>{selectedSampleEvent.site_name}</StyledHeader>
      </SelectedSiteSiteCardContainer>
    </StyledVisibleBackground>
  )

  const SelectedSiteBody = () => {
    if (!isDesktopWidth) {
      return
    }

    const sampleEventAdmins = selectedSampleEvent.project_admins
      .map((admin) => admin.name)
      .join(', ')
    const sampleEventOrganizations = selectedSampleEvent.tags?.map((tag) => tag.name).join(', ')

    return (
      <>
        <SelectedSiteMetricsCardContainer>
          <BiggerIconTextBoxMultiple />
          <SelectedSiteContentContainer>
            <StyledHeader>Project</StyledHeader>
            <span>
              {selectedSampleEvent.project_name}{' '}
              {userIsMemberOfProject(selectedSampleEvent.project_id, mermaidUserData) ? (
                <IconPersonCircle />
              ) : null}
            </span>
          </SelectedSiteContentContainer>
        </SelectedSiteMetricsCardContainer>
        <SelectedSiteMetricsCardContainer>
          <BiggerIconCalendar />
          <SelectedSiteContentContainer>
            <StyledHeader>Sample Date</StyledHeader>
            <span>{selectedSampleEvent.sample_date}</span>
          </SelectedSiteContentContainer>
        </SelectedSiteMetricsCardContainer>
        <StyledSummaryMetadataContainer>
          <StyledMetricsSelector>
            <input
              id="metrics-summary"
              type="radio"
              name="summary"
              checked={metricsView === 'summary'}
              onChange={handleChangeMetricsView}
            />
            <label htmlFor="metrics-summary">Summary</label>
          </StyledMetricsSelector>
          <StyledMetricsSelector>
            <input
              id="metrics-metadata"
              type="radio"
              name="metadata"
              checked={metricsView === 'metadata'}
              onChange={handleChangeMetricsView}
            />
            <label htmlFor="metrics-metadata">Metadata</label>
          </StyledMetricsSelector>
        </StyledSummaryMetadataContainer>
        {metricsView === 'summary' ? (
          <span>Placeholder: show summary metrics here</span>
        ) : (
          <>
            <SelectedSiteMetricsCardContainer>
              <BiggerIconPersonCircle />
              <SelectedSiteContentContainer>
                <StyledHeader>Management Regime</StyledHeader>
                <span>{selectedSampleEvent.management_name}</span>
              </SelectedSiteContentContainer>
            </SelectedSiteMetricsCardContainer>
            <SelectedSiteMetricsCardContainer>
              <BiggerIconUser />
              <SelectedSiteContentContainer>
                <StyledHeader>Admins</StyledHeader>
                <span>{sampleEventAdmins}</span>
              </SelectedSiteContentContainer>
            </SelectedSiteMetricsCardContainer>
            <SelectedSiteMetricsCardContainer>
              <BiggerIconGlobe />
              <SelectedSiteContentContainer>
                <StyledHeader>Organizations</StyledHeader>
                <span>{sampleEventOrganizations}</span>
              </SelectedSiteContentContainer>
            </SelectedSiteMetricsCardContainer>
            <SelectedSiteMetricsCardContainer>
              <StyledSvgContainer>
                <img src={coralReefSvg} alt="coral reef" />
              </StyledSvgContainer>
              <SelectedSiteContentContainer>
                <StyledHeader>Reef Habitat</StyledHeader>
                <StyledReefContainer>
                  <StyledReefRow>
                    <StyledReefItemBold>Reef Zone</StyledReefItemBold>
                    <StyledReefItem>{selectedSampleEvent.reef_zone}</StyledReefItem>
                  </StyledReefRow>
                  <StyledReefRow>
                    <StyledReefItemBold>Reef Type</StyledReefItemBold>
                    <StyledReefItem>{selectedSampleEvent.reef_type}</StyledReefItem>
                  </StyledReefRow>
                  <StyledReefRow>
                    <StyledReefItemBold>Reef Exposure</StyledReefItemBold>
                    <StyledReefItem>{selectedSampleEvent.reef_exposure}</StyledReefItem>
                  </StyledReefRow>
                </StyledReefContainer>
              </SelectedSiteContentContainer>
            </SelectedSiteMetricsCardContainer>
            <SelectedSiteMetricsCardContainer>
              <BiggerIconText />
              <SelectedSiteContentContainer>
                <StyledHeader>Notes</StyledHeader>
                <span>{selectedSampleEvent.site_notes}</span>
              </SelectedSiteContentContainer>
            </SelectedSiteMetricsCardContainer>
          </>
        )}
      </>
    )
  }

  const countryLabel = numUniqueCountries === 1 ? 'Country' : 'Countries'

  const transectAndProjectCountCards = (
    <>
      <MetricsCard>
        <MetricCardPMedium>{numTransects.toLocaleString()}</MetricCardPMedium>
        <MetricCardH3>Transects</MetricCardH3>
      </MetricsCard>
      <MetricsCard>
        <MetricCardPMedium>{getActiveProjectCount().toLocaleString()}</MetricCardPMedium>
        <MetricCardH3>Projects </MetricCardH3>
      </MetricsCard>
    </>
  )

  const displayedProjectsMetrics = (
    <SummarizedMetrics
      onClick={toggleMobileMetricsPane}
      $isDesktopWidth={isDesktopWidth}
      $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
      $showLoadingIndicator={showLoadingIndicator}
    >
      <MetricsCard>
        <MetricCardPBig>{numSurveys.toLocaleString()}</MetricCardPBig>
        <MetricCardH3>Surveys</MetricCardH3>
      </MetricsCard>
      <MetricsCard>
        {isDesktopWidth ? (
          <InlineOnDesktopMetricWrapper>
            <span>{numUniqueCountries.toLocaleString()}</span>{' '}
            <MetricCardH3>{countryLabel}</MetricCardH3>
          </InlineOnDesktopMetricWrapper>
        ) : (
          <>
            <MetricCardPBig>{numUniqueCountries.toLocaleString()}</MetricCardPBig>
            <MetricCardH3>{countryLabel}</MetricCardH3>
          </>
        )}
      </MetricsCard>
      {isDesktopWidth ? (
        <MultipleMetricCardsRow>{transectAndProjectCountCards}</MultipleMetricCardsRow>
      ) : (
        transectAndProjectCountCards
      )}

      {isDesktopWidth ? <MetricsCard>{calculateMetrics.yearRange}</MetricsCard> : null}
    </SummarizedMetrics>
  )

  const metricsContent = selectedSampleEvent ? (
    <>
      <SelectedSiteHeader />
      <SelectedSiteActionBar>
        {getIsSiteSelected() && isMapView ? (
          <ButtonSecondary onClick={() => zoomToSelectedSite({ displayedProjects, map })}>
            <ZoomToSiteIcon /> &nbsp;Zoom
          </ButtonSecondary>
        ) : null}
        <ButtonSecondary onClick={handleClearSelectedSampleEvent}>
          <IconClose /> Clear
        </ButtonSecondary>
      </SelectedSiteActionBar>
      <SelectedSiteBody />
    </>
  ) : (
    <>{displayedProjectsMetrics}</>
  )

  const handleFollowScreen = (e) => {
    setEnableFollowScreen((prevState) => !prevState)

    const { checked } = e.target
    const queryParams = getURLParams()
    if (checked) {
      queryParams.set('follow_screen', 'true')
    } else {
      queryParams.delete('follow_screen')
    }
    updateURLParams(queryParams)
  }

  return (
    <StyledMetricsWrapper
      $showMetricsPane={showMetricsPane}
      $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
      $showLoadingIndicator={showLoadingIndicator}
      $isDesktopWidth={isDesktopWidth}
    >
      {isMobileWidth || showMetricsPane ? metricsContent : null}
      {isMobileWidth && showMobileExpandedMetricsPane ? (
        <MobileExpandedMetricsPane>Placeholder: more metrics here</MobileExpandedMetricsPane>
      ) : null}
      {isDesktopWidth && view === 'mapView' && showMetricsPane && !selectedMarkerId ? (
        <DesktopFollowScreenButton
          onClick={() =>
            handleFollowScreen({
              target: { checked: !enableFollowScreen },
            })
          }
        >
          <input
            type="checkbox"
            id="follow-screen"
            checked={enableFollowScreen}
            onChange={handleFollowScreen}
            onClick={(e) => e.stopPropagation()}
          />
          <StyledLabel htmlFor="follow-screen" onClick={(e) => e.stopPropagation()}>
            Update metrics based on map view
          </StyledLabel>
        </DesktopFollowScreenButton>
      ) : null}
      {isDesktopWidth ? (
        <DesktopToggleMetricsPaneButton onClick={handleShowMetricsPane}>
          {showMetricsPane ? (
            <>
              <span>Metrics</span>
              <StyledChevronSpan>{String.fromCharCode(10095)}</StyledChevronSpan>
            </>
          ) : (
            <>
              <span>Metrics</span>
              <StyledChevronSpan>{String.fromCharCode(10094)}</StyledChevronSpan>
            </>
          )}
        </DesktopToggleMetricsPaneButton>
      ) : (
        <MobileExpandMetricsPaneButton
          onClick={handleShowMobileExpandedMetricsPane}
          $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
          aria-label={showMobileExpandedMetricsPane ? 'Collapse Metrics' : 'Expand Metrics'}
        >
          {showMobileExpandedMetricsPane ? <BiggerIconCaretDown /> : <BiggerIconCaretUp />}
        </MobileExpandMetricsPaneButton>
      )}
    </StyledMetricsWrapper>
  )
}

MetricsPane.propTypes = {
  showMetricsPane: PropTypes.bool.isRequired,
  setShowMetricsPane: PropTypes.func.isRequired,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
}

export default MetricsPane
