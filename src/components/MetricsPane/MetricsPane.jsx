import { useEffect, useState, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import useResponsive from '../../hooks/useResponsive'
import {
  StyledMetricsWrapper,
  SummarizedMetrics,
  MetricsCard,
  MultipleMetricCardsRow,
  DesktopToggleMetricsPaneButton,
  MobileExpandMetricsPaneButton,
  BiggerIconCaretDown,
  BiggerIconCaretUp,
  StyledChevronSpan,
  DesktopFollowScreenButton,
  StyledLabel,
  MetricCardH3,
  MetricCardPBig,
  MetricCardPMedium,
  InlineOnDesktopMetricWrapper,
} from './MetricsPane.styles'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import LoadingIndicator from '../MermaidDash/components/LoadingIndicator'
import { SelectedSiteMetrics } from './SelectedSiteMetrics'
import { SelectedProjectMetrics } from './SelectedProjectMetrics'
import { MetricsPaneChartTabs } from './MetricsPaneChartTabs'
import { AggregateHardCoralCover } from './charts/AggregateHardCoralCover'
import { AggregateFishBiomass } from './charts/AggregateFishBiomas'

const ARROW_RIGHT = String.fromCharCode(10095)
const ARROW_LEFT = String.fromCharCode(10094)

const MetricsPane = ({
  setShowLoadingIndicator,
  setShowMetricsPane,
  showLoadingIndicator,
  showMetricsPane,
  view,
}) => {
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
    projectData,
    selectedMarkerId,
    setEnableFollowScreen,
    updateURLParams,
    selectedProject,
    setSelectedProject,
  } = useContext(FilterProjectsContext)
  const [selectedSampleEvent, setSelectedSampleEvent] = useState(null)

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
      <MetricsPaneChartTabs
        id="hard-coral-cover"
        aggregatePanelContent={<AggregateHardCoralCover />}
        timeSeriesPanelContent={<div style={{ height: '270px' }}>Coming soon</div>}
      />
      <MetricsPaneChartTabs
        id="fish-biomass"
        aggregatePanelContent={<AggregateFishBiomass />}
        timeSeriesPanelContent={<div style={{ height: '270px' }}>Coming soon</div>}
      />
    </SummarizedMetrics>
  )

  const metricsContent =
    selectedProject && isDesktopWidth ? (
      <SelectedProjectMetrics
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    ) : selectedSampleEvent ? (
      <SelectedSiteMetrics
        view={view}
        selectedSampleEvent={selectedSampleEvent}
        setSelectedSampleEvent={setSelectedSampleEvent}
        showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
        setShowMobileExpandedMetricsPane={setShowMobileExpandedMetricsPane}
      />
    ) : (
      displayedProjectsMetrics
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
    <>
      <StyledMetricsWrapper
        $showMetricsPane={showMetricsPane}
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
        {isMobileWidth || showMetricsPane ? metricsContent : null}
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
        {isMobileWidth ? (
          <LoadingIndicator
            currentProgress={projectData?.results?.length || 0}
            finalProgress={projectData?.count || 0}
            showLoadingIndicator={showLoadingIndicator}
            setShowLoadingIndicator={setShowLoadingIndicator}
            isRelativelyPositioned={true}
          />
        ) : null}
      </StyledMetricsWrapper>
      {isDesktopWidth ? (
        <DesktopToggleMetricsPaneButton
          onClick={handleShowMetricsPane}
          $showMetricsPane={showMetricsPane}
        >
          <span>Metrics</span>
          <StyledChevronSpan>{showMetricsPane ? ARROW_RIGHT : ARROW_LEFT}</StyledChevronSpan>
        </DesktopToggleMetricsPaneButton>
      ) : null}
    </>
  )
}

MetricsPane.propTypes = {
  showMetricsPane: PropTypes.bool.isRequired,
  setShowMetricsPane: PropTypes.func.isRequired,
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  setShowLoadingIndicator: PropTypes.func.isRequired,
}

export default MetricsPane
