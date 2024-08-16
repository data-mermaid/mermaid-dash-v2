import { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import useResponsive from '../../hooks/useResponsive'
import {
  StyledMetricsWrapper,
  SummarizedMetrics,
  MetricsCard,
  P,
  H3,
  SurveysAndTransectsContainer,
  MobileExpandedMetricsPane,
  DesktopToggleMetricsPaneButton,
  MobileExpandMetricsPaneButton,
  BiggerIconCaretDown,
  BiggerIconCaretUp,
  StyledChevronSpan,
} from './MetricsPane.styles'
import { useFilterProjectsContext } from '../../context/FilterProjectsContext'

const MetricsPane = ({
  displayedProjects,
  showMetricsPane,
  setShowMetricsPane,
  showLoadingIndicator,
}) => {
  const [numSurveys, setNumSurveys] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [yearRange, setYearRange] = useState('')
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)
  const { isMobileWidth, isDesktopWidth } = useResponsive()
  const { checkedProjects, getActiveProjectCount } = useFilterProjectsContext()

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
      sortedYears.length === 0
        ? 'No data to obtain year range'
        : sortedYears.length === 1
          ? `Showing data from ${sortedYears[0]}`
          : `Showing data from ${sortedYears[0]} to ${sortedYears[sortedYears.length - 1]}`

    return {
      numSurveys: surveys,
      numTransects: transects,
      numUniqueCountries: countries.size,
      yearRange,
    }
  }, [displayedProjects, checkedProjects])

  const _setMetricsAfterCalculating = useEffect(() => {
    const { numSurveys, numTransects, numUniqueCountries, yearRange } = calculateMetrics
    setNumSurveys(numSurveys)
    setNumTransects(numTransects)
    setNumUniqueCountries(numUniqueCountries)
    setYearRange(yearRange)
  }, [calculateMetrics])

  const handleShowMetricsPane = () => {
    setShowMetricsPane((prevState) => !prevState)
  }

  const handleShowMobileExpandedMetricsPane = () => {
    setShowMobileExpandedMetricsPane((prevState) => !prevState)
  }

  const handleMobileSummarizedMetricsClick = () => {
    handleShowMobileExpandedMetricsPane()
  }

  return (
    <StyledMetricsWrapper
      $showMetricsPane={showMetricsPane}
      $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
      $showLoadingIndicator={showLoadingIndicator}
      $isDesktopWidth={isDesktopWidth}
    >
      {isMobileWidth || showMetricsPane ? (
        <SummarizedMetrics
          onClick={handleMobileSummarizedMetricsClick}
          $isDesktopWidth={isDesktopWidth}
          $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
          $showLoadingIndicator={showLoadingIndicator}
        >
          <MetricsCard>
            <P>{getActiveProjectCount()}</P>
            <H3>Projects </H3>
          </MetricsCard>
          <SurveysAndTransectsContainer>
            <MetricsCard>
              <P>{numSurveys}</P>
              <H3>Surveys</H3>
            </MetricsCard>
            <MetricsCard>
              <P>{numTransects}</P>
              <H3>Transects</H3>
            </MetricsCard>
          </SurveysAndTransectsContainer>
          {isDesktopWidth ? (
            <MetricsCard>
              <P>{yearRange}</P>
            </MetricsCard>
          ) : null}

          <MetricsCard>
            <P>{numUniqueCountries}</P>
            <H3>{numUniqueCountries === 1 ? 'Country' : 'Countries'}</H3>
          </MetricsCard>
        </SummarizedMetrics>
      ) : null}
      {isMobileWidth && showMobileExpandedMetricsPane ? (
        <MobileExpandedMetricsPane>Placeholder: more metrics here</MobileExpandedMetricsPane>
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
  displayedProjects: PropTypes.arrayOf(
    PropTypes.shape({
      created_on: PropTypes.string.isRequired,
      project_id: PropTypes.string.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({
          country_name: PropTypes.string.isRequired,
          site_name: PropTypes.string.isRequired,
          sample_date: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  showMetricsPane: PropTypes.bool.isRequired,
  setShowMetricsPane: PropTypes.func.isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
}

export default MetricsPane
