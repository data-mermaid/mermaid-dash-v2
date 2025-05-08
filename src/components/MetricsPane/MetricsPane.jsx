import { useEffect, useState, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

import {
  StyledMetricsWrapper,
  SummarizedMetrics,
  MultipleMetricCardsRow,
  DesktopToggleMetricsPaneButton,
  MobileExpandMetricsPaneButton,
  BiggerIconCaretDown,
  BiggerIconCaretUp,
  StyledChevronSpan,
  MetricsCard,
  MetricCardInlineText,
  MetricCardH3,
  MetricCardPBig,
  MetricCardPMedium,
  InlineOnDesktopMetricWrapper,
  DisplayedProjectsMetricsWrapper,
  ChartsWrapper,
  FollowToggleContainer,
  MapAttributeRow,
  CircleLoader,
  StyledFollowIconButton,
  StyledFollowButton,
} from './MetricsPane.styles'
import zoomToMap from '../../assets/zoom-map.svg'
import { ARROW_LEFT, ARROW_RIGHT } from '../../assets/arrowIcons'
import {
  mapAttributeText,
  mapControlButtonText,
  noDataText,
  tooltipText,
} from '../../constants/language'
import { URL_PARAMS } from '../../constants/constants'

import { MuiTooltip } from '../generic/MuiTooltip'
import LoadingIndicator from '../MermaidDash/components/LoadingIndicator'
import LoadingBar from '../MermaidDash/components/LoadingBar'
import { SelectedSiteMetrics } from './SelectedSiteMetrics'
import { SelectedProjectMetrics } from './SelectedProjectMetrics'
import { MetricsPaneChartTabs } from './MetricsPaneChartTabs'
import { AggregateHardCoralCover } from './charts/AggregateHardCoralCover'
import { TimeSeriesBenthicCover } from './charts/TimeSeriesBenthicCover'
import { AggregateFishBiomass } from './charts/AggregateFishBiomas'
import { TimeSeriesFishBiomass } from './charts/TimeSeriesFishBiomass'
import { AggregateBleaching } from './charts/AggregateBleaching'
import { AggregateHabitatComplexity } from './charts/AggregateHabitatComplexity'
import { TimeSeriesHabitatComplexity } from './charts/TimeSeriesHabitatComplexity'
import { TimeSeriesBleaching } from './charts/TimeSeriesBleaching'
import { pluralizeWord } from '../../helperFunctions/pluralize'

const MetricsPane = ({
  setShowLoadingIndicator,
  setIsMetricsPaneShowing,
  showLoadingIndicator,
  isMetricsPaneShowing,
  view,
  mapWidth,
}) => {
  const [numSurveys, setNumSurveys] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const {
    displayedProjects,
    enableFollowScreen,
    getActiveProjectCount,
    getURLParams,
    projectData,
    selectedMarkerId,
    setEnableFollowScreen,
    updateURLParams,
    selectedProject,
    setSelectedProject,
    omittedMethodDataSharingFilters,
  } = useContext(FilterProjectsContext)
  const [selectedSampleEvent, setSelectedSampleEvent] = useState(null)

  const calculateMetrics = useMemo(() => {
    let surveys = 0
    let transects = 0
    let countries = new Set()
    let years = new Set()

    displayedProjects.forEach((project) => {
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
        <InlineOnDesktopMetricWrapper>{noDataText.noYearRange}</InlineOnDesktopMetricWrapper>
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
  }, [displayedProjects])

  const _setMetricsAfterCalculating = useEffect(() => {
    const { numSurveys, numTransects, numUniqueCountries } = calculateMetrics
    setNumSurveys(numSurveys)
    setNumTransects(numTransects)
    setNumUniqueCountries(numUniqueCountries)
  }, [calculateMetrics])

  const _getSelectedSampleEvent = useEffect(() => {
    const foundSelectedSampleEvent = displayedProjects
      .map((project) =>
        project.records.find((record) => record.sample_event_id === selectedMarkerId),
      )
      .find((record) => record !== undefined)

    setSelectedSampleEvent(foundSelectedSampleEvent)
  }, [selectedMarkerId, displayedProjects])

  const handleShowMetricsPane = () => {
    setIsMetricsPaneShowing((prevState) => !prevState)
  }

  const handleShowMobileExpandedMetricsPane = () => {
    setShowMobileExpandedMetricsPane((prevState) => !prevState)
  }

  const toggleMobileMetricsPane = () => {
    handleShowMobileExpandedMetricsPane()
  }

  const transectAndProjectCountCards = (
    <>
      <MetricsCard>
        <MetricCardPMedium>{numTransects.toLocaleString()}</MetricCardPMedium>
        <MetricCardH3>{pluralizeWord(numTransects ?? 0, 'Transect')}</MetricCardH3>
      </MetricsCard>
      <MetricsCard>
        <MetricCardPMedium>{getActiveProjectCount().toLocaleString()}</MetricCardPMedium>
        <MetricCardH3>{pluralizeWord(getActiveProjectCount() ?? 0, 'Project')}</MetricCardH3>
      </MetricsCard>
    </>
  )

  const fishBeltFilterToggleOn = !omittedMethodDataSharingFilters.includes('bf_all')
  const benthicsFilterToggleOn = ['bl_all', 'bp_all', 'qbp_all'].some(
    (filterLabel) => !omittedMethodDataSharingFilters.includes(filterLabel),
  )
  const bleachingFilterToggleOn = !omittedMethodDataSharingFilters.includes('cb_all')
  const habitatComplexityFilterToggleOn = !omittedMethodDataSharingFilters.includes('hc_all')

  const noChartsToDisplay = (
    <>
      <div>{noDataText.noChartsOnCurrentFilters[0]}</div>
      <div>{noDataText.noChartsOnCurrentFilters[1]}</div>
    </>
  )

  const displayedProjectsMetrics = (
    <DisplayedProjectsMetricsWrapper>
      <SummarizedMetrics
        onClick={toggleMobileMetricsPane}
        $isDesktopWidth={isDesktopWidth}
        $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
        $showLoadingIndicator={showLoadingIndicator}
      >
        <MetricsCard>
          <MetricCardPBig>{numSurveys.toLocaleString()}</MetricCardPBig>
          <MetricCardInlineText>
            <CircleLoader showLoadingCircle={showLoadingIndicator && isDesktopWidth} />
            <MetricCardH3>
              {isDesktopWidth && showLoadingIndicator && 'Loading'}{' '}
              {pluralizeWord(numSurveys ?? 0, 'Survey')}
            </MetricCardH3>
          </MetricCardInlineText>
          {isDesktopWidth && (
            <LoadingBar
              showLoadingIndicator={showLoadingIndicator}
              setShowLoadingIndicator={setShowLoadingIndicator}
              currentProgress={projectData?.results?.length ?? 0}
              finalProgress={projectData?.count ?? 0}
            />
          )}
        </MetricsCard>
        <MetricsCard>
          {isDesktopWidth ? (
            <InlineOnDesktopMetricWrapper>
              <span>{numUniqueCountries.toLocaleString()}</span>{' '}
              <MetricCardH3>
                {pluralizeWord(numUniqueCountries ?? 0, 'Country', 'Countries')}
              </MetricCardH3>
            </InlineOnDesktopMetricWrapper>
          ) : (
            <>
              <MetricCardPBig>{numUniqueCountries.toLocaleString()}</MetricCardPBig>
              <MetricCardH3>
                {pluralizeWord(numUniqueCountries ?? 0, 'Country', 'Countries')}
              </MetricCardH3>
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
      <ChartsWrapper $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}>
        {numSurveys === 0 ? (
          noChartsToDisplay
        ) : (
          <>
            {benthicsFilterToggleOn && (
              <MetricsPaneChartTabs
                id="hard-coral-cover"
                aggregatePanelContent={<AggregateHardCoralCover />}
                timeSeriesPanelContent={<TimeSeriesBenthicCover />}
              />
            )}
            {fishBeltFilterToggleOn && (
              <MetricsPaneChartTabs
                id="fish-biomass"
                aggregatePanelContent={<AggregateFishBiomass />}
                timeSeriesPanelContent={<TimeSeriesFishBiomass />}
              />
            )}
            {bleachingFilterToggleOn && (
              <MetricsPaneChartTabs
                id="bleaching"
                aggregatePanelContent={<AggregateBleaching />}
                timeSeriesPanelContent={<TimeSeriesBleaching />}
              />
            )}
            {habitatComplexityFilterToggleOn && (
              <MetricsPaneChartTabs
                id="habitat-complexity"
                aggregatePanelContent={<AggregateHabitatComplexity />}
                timeSeriesPanelContent={<TimeSeriesHabitatComplexity />}
              />
            )}
          </>
        )}
      </ChartsWrapper>
      <MapAttributeRow $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}>
        {mapAttributeText}
      </MapAttributeRow>
    </DisplayedProjectsMetricsWrapper>
  )

  const metricsContent =
    selectedProject && isDesktopWidth ? (
      <SelectedProjectMetrics
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    ) : selectedSampleEvent ? (
      <SelectedSiteMetrics
        selectedSampleEvent={selectedSampleEvent}
        setSelectedSampleEvent={setSelectedSampleEvent}
        showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
      />
    ) : (
      displayedProjectsMetrics
    )

  const handleFollowScreen = () => {
    setEnableFollowScreen((prevState) => !prevState)

    const newState = !enableFollowScreen
    const queryParams = getURLParams()

    if (newState) {
      queryParams.set(URL_PARAMS.FOLLOW_SCREEN, 'true')
    } else {
      queryParams.delete(URL_PARAMS.FOLLOW_SCREEN)
    }

    updateURLParams(queryParams)
  }

  return (
    <>
      <StyledMetricsWrapper
        $isMetricsPaneShowing={isMetricsPaneShowing}
        $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
        $showLoadingIndicator={showLoadingIndicator}
        $isDesktopWidth={isDesktopWidth}
      >
        {isMobileWidth ? (
          <MobileExpandMetricsPaneButton
            onClick={handleShowMobileExpandedMetricsPane}
            $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
            aria-label={showMobileExpandedMetricsPane ? 'Collapse Metrics' : 'Expand Metrics'}
          >
            {showMobileExpandedMetricsPane ? <BiggerIconCaretDown /> : <BiggerIconCaretUp />}
          </MobileExpandMetricsPaneButton>
        ) : null}
        {isMobileWidth || isMetricsPaneShowing ? metricsContent : null}
        {isMobileWidth ? (
          <LoadingIndicator
            currentProgress={projectData?.results?.length ?? 0}
            finalProgress={projectData?.count ?? 0}
            showLoadingIndicator={showLoadingIndicator}
            setShowLoadingIndicator={setShowLoadingIndicator}
            isRelativelyPositioned={true}
          />
        ) : null}
        {isDesktopWidth && view === 'mapView' && isMetricsPaneShowing && !selectedMarkerId ? (
          <FollowToggleContainer $mapWidth={mapWidth} $enableFollowScreen={enableFollowScreen}>
            {mapWidth < 810 ? (
              <MuiTooltip
                title={
                  enableFollowScreen ? tooltipText.disableFollowMap : tooltipText.enableFollowMap
                }
              >
                <StyledFollowIconButton
                  onClick={handleFollowScreen}
                  $enableFollowScreen={enableFollowScreen}
                >
                  <img src={zoomToMap} alt="Update metrics based on map view" />
                </StyledFollowIconButton>
              </MuiTooltip>
            ) : (
              <StyledFollowButton
                onClick={handleFollowScreen}
                $enableFollowScreen={enableFollowScreen}
              >
                <img src={zoomToMap} alt="Update metrics based on map view" />
                <span>
                  {enableFollowScreen
                    ? mapControlButtonText.filterMapDisabled
                    : mapControlButtonText.filterMapEnabled}
                </span>
              </StyledFollowButton>
            )}
          </FollowToggleContainer>
        ) : null}
        {isDesktopWidth ? (
          <DesktopToggleMetricsPaneButton
            onClick={handleShowMetricsPane}
            $isMetricsPaneShowing={isMetricsPaneShowing}
          >
            <MuiTooltip
              title={isMetricsPaneShowing ? tooltipText.hideMetrics : tooltipText.showMetrics}
            >
              <StyledChevronSpan>
                {isMetricsPaneShowing ? ARROW_RIGHT : ARROW_LEFT}
              </StyledChevronSpan>
            </MuiTooltip>
          </DesktopToggleMetricsPaneButton>
        ) : null}
      </StyledMetricsWrapper>
    </>
  )
}

MetricsPane.propTypes = {
  isMetricsPaneShowing: PropTypes.bool.isRequired,
  setIsMetricsPaneShowing: PropTypes.func.isRequired,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  setShowLoadingIndicator: PropTypes.func.isRequired,
  mapWidth: PropTypes.number.isRequired,
}

export default MetricsPane
