import { useEffect, useState, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

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
import { MAP_VIEW, TABLE_VIEW, URL_PARAMS } from '../../constants/constants'

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
import { IconInfo } from '../../assets/icons'
import { IconButton } from '../generic'
import theme from '../../styles/theme'
import { ResponsiveTooltip } from '../generic/ResponsiveTooltip'

const MetricsPane = ({
  setShowLoadingIndicator,
  setIsMetricsPaneShowing,
  showLoadingIndicator,
  isMetricsPaneShowing,
  view,
  mapWidth,
}) => {
  const { t } = useTranslation()
  const [numSurveys, setNumSurveys] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [numProjectsWithoutData, setNumProjectsWithoutData] = useState(0)
  const [numProjectsWithData, setNumProjectWithData] = useState(0)
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const {
    displayedProjects,
    enableFollowScreen,
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
  const noDataYearRangeText = t('no_data_year_range')
  const isMapView = view === MAP_VIEW
  const displayedProjectCount = displayedProjects?.length || 0

  const calculateMetrics = useMemo(() => {
    let surveys = 0
    let transects = 0
    let countries = new Set()
    let years = new Set()
    let projectWithoutDataCount = 0

    displayedProjects.forEach((project) => {
      const { records = [] } = project
      const numRecords = records.length

      if (numRecords === 0) {
        projectWithoutDataCount++
        return
      }

      surveys += numRecords

      records.forEach((record) => {
        Object.values(record.protocols).forEach((value) => {
          transects += value.sample_unit_count
        })
        countries.add(record.country_name)
        years.add(record.sample_date.split('-')[0])
      })
    })

    const projectWithDataCount = displayedProjects?.length - projectWithoutDataCount
    const sortedYears = Array.from(years).sort()
    const yearRange =
      sortedYears.length === 0 ? (
        <InlineOnDesktopMetricWrapper>{noDataYearRangeText}</InlineOnDesktopMetricWrapper>
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
      numProjectsWithData: projectWithDataCount,
      numProjectsWithoutData: projectWithoutDataCount,
    }
  }, [displayedProjects, noDataYearRangeText])

  const _setMetricsAfterCalculating = useEffect(() => {
    const {
      numSurveys,
      numTransects,
      numUniqueCountries,
      numProjectsWithData,
      numProjectsWithoutData,
    } = calculateMetrics
    setNumSurveys(numSurveys)
    setNumTransects(numTransects)
    setNumUniqueCountries(numUniqueCountries)
    setNumProjectWithData(numProjectsWithData)
    setNumProjectsWithoutData(numProjectsWithoutData)
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

  const projectCountTooltipTitle = (
    <>
      <div>
        {t('project_with_data_count', {
          count: numProjectsWithData,
        })}
      </div>
      <div>
        {t('project_without_data_count', {
          count: numProjectsWithoutData,
        })}
      </div>
    </>
  )

  const transectAndProjectCountCards = (
    <>
      <MetricsCard>
        <MetricCardPMedium>{numTransects.toLocaleString()}</MetricCardPMedium>
        <MetricCardH3>{t('transect', { count: numTransects })}</MetricCardH3>
      </MetricsCard>
      <MetricsCard>
        <MetricCardPMedium>
          {isMapView
            ? numProjectsWithData.toLocaleString()
            : displayedProjectCount.toLocaleString()}
        </MetricCardPMedium>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MetricCardH3>{t('project', { count: numProjectsWithData })}</MetricCardH3>
          {isMapView && numProjectsWithoutData > 0 && (
            <ResponsiveTooltip
              title={projectCountTooltipTitle}
              bgColor={theme.color.primaryColor}
              tooltipTextColor={theme.color.white}
              isMobileWidth={isMobileWidth}
            >
              <IconButton
                type="button"
                aria-label={t('project_count_information')}
                style={{
                  display: 'flex',
                }}
              >
                <IconInfo />
              </IconButton>
            </ResponsiveTooltip>
          )}
        </div>
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
      <div>{t('no_data_visualization')}</div>
      <div>{t('refine_filters')}</div>
    </>
  )

  const displayedProjectsMetrics = (
    <DisplayedProjectsMetricsWrapper>
      <SummarizedMetrics
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
        {t('map_attribute_source')}
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
        {isDesktopWidth && isMapView && isMetricsPaneShowing && !selectedMarkerId ? (
          <FollowToggleContainer $mapWidth={mapWidth} $enableFollowScreen={enableFollowScreen}>
            {mapWidth < 830 ? (
              <MuiTooltip
                title={
                  enableFollowScreen ? t('disable_map_view_metrics') : t('enable_map_view_metrics')
                }
              >
                <StyledFollowIconButton
                  onClick={handleFollowScreen}
                  $enableFollowScreen={enableFollowScreen}
                >
                  <img src={zoomToMap} alt={t('zoom_to_filtered_data')} />
                </StyledFollowIconButton>
              </MuiTooltip>
            ) : (
              <StyledFollowButton
                onClick={handleFollowScreen}
                $enableFollowScreen={enableFollowScreen}
              >
                <img src={zoomToMap} alt={t('zoom_to_map_extent')} />
                <span>{enableFollowScreen ? t('disable_follow_map') : t('enable_follow_map')}</span>
              </StyledFollowButton>
            )}
          </FollowToggleContainer>
        ) : null}
        {isDesktopWidth ? (
          <DesktopToggleMetricsPaneButton
            onClick={handleShowMetricsPane}
            $isMetricsPaneShowing={isMetricsPaneShowing}
          >
            <MuiTooltip title={isMetricsPaneShowing ? t('hide_metrics') : t('show_metrics')}>
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
  view: PropTypes.oneOf([MAP_VIEW, TABLE_VIEW]).isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  setShowLoadingIndicator: PropTypes.func.isRequired,
  mapWidth: PropTypes.number.isRequired,
}

export default MetricsPane
