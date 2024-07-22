import { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import useResponsive from '../../library/useResponsive'
import {
  StyledMetricsWrapper,
  SummarizedMetrics,
  MetricsCard,
  P,
  H3,
  SitesAndTransectsContainer,
  MobileExpandedMetricsPane,
  DesktopToggleMetricsPaneButton,
  MobileExpandMetricsPaneButton,
  BiggerIconCaretDown,
  BiggerIconCaretUp,
} from './MetricsPane.styles'

const MetricsPane = ({
  displayedProjects,
  showMetricsPane,
  setShowMetricsPane,
  showLoadingIndicator,
}) => {
  const [numSites, setNumSites] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [yearRange, setYearRange] = useState('')
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)
  const { isMobileWidth, isDesktopWidth } = useResponsive()

  const calculateMetrics = useMemo(() => {
    let sites = new Set()
    let transects = 0
    let countries = new Set()
    let years = new Set()

    displayedProjects.forEach((project) => {
      project.records.forEach((record) => {
        Object.values(record.protocols).forEach((value) => {
          transects += value.sample_unit_count
        })
        countries.add(record.country_name)
        sites.add(record.site_name)
        years.add(record.sample_date.split('-')[0])
      })
    })

    const sortedYears = Array.from(years).sort()
    const yearRange =
      sortedYears.length === 0
        ? 'No data to obtain year range'
        : sortedYears.length === 1
          ? `Showing data from ${sortedYears[0]}`
          : `Showing data from ${sortedYears[0]} to ${sortedYears[sortedYears.length - 1]}`

    return {
      numSites: sites.size,
      numTransects: transects,
      numUniqueCountries: countries.size,
      yearRange,
    }
  }, [displayedProjects])

  useEffect(() => {
    const { numSites, numTransects, numUniqueCountries, yearRange } = calculateMetrics
    setNumSites(numSites)
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
    >
      {isMobileWidth || showMetricsPane ? (
        <SummarizedMetrics
          onClick={handleMobileSummarizedMetricsClick}
          $isDesktopWidth={isDesktopWidth}
          $showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
          $showLoadingIndicator={showLoadingIndicator}
        >
          <MetricsCard>
            <P>{displayedProjects.length}</P>
            <H3>Projects </H3>
          </MetricsCard>
          <SitesAndTransectsContainer>
            <MetricsCard>
              <P>{numSites}</P>
              <H3>Sites</H3>
            </MetricsCard>
            <MetricsCard>
              <P>{numTransects}</P>
              <H3>Transects</H3>
            </MetricsCard>
          </SitesAndTransectsContainer>
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
          {showMetricsPane ? String.fromCharCode(10095) : String.fromCharCode(10094)}{' '}
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
