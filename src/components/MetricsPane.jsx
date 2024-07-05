import { useEffect, useState, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import theme from '../theme'
import { ButtonSecondary } from './generic/buttons'

const mobileWidthThreshold = 960

const StyledMetricsWrapper = styled('div')`
  ${(props) => props.showMetricsPane === true && 'width: 40%;'}
  position: relative;
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    z-index: 5;
    background-color: transparent;
    width: 90%;
    bottom: 8rem;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
  `)}
`

const SummarizedMetrics = styled('div')`
  width: 100%;
  overflow-y: scroll;
  height: calc(100vh - 10rem);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
    height: 100%;
    overflow-y: hidden;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 0;
  `)}
`

const DesktopToggleMetricsPaneButton = styled('button')`
  position: absolute;
  top: 1.3rem;
  left: -4rem;
  height: 6rem;
  z-index: 5;
  width: 4rem;
  border: none;
  cursor: pointer;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

const MobileExpandMetricsPaneButton = styled(ButtonSecondary)`
  display: none;
  ${mediaQueryTabletLandscapeOnly(css`
    display: block;
    position: absolute;
    top: -4rem;
    justify-self: center;
    background-color: transparent;
    border: none;
    color: ${theme.color.white};
  `)}
`

const SitesAndTransectsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
    order: -1;
    flex-grow: 2;
  `)}
`

const MetricsCard = styled('div')`
  background-color: ${theme.color.white};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    margin: 0;
    width: auto;
    flex-grow: 1;
  `)}
`

const H3 = styled('h3')`
  padding: 0;
  margin: 0.5rem;
`

const H4 = styled('h4')`
  padding: 0;
  margin: 0.5rem;
`

const MobileExpandedMetricsPane = styled('div')`
  background-color: ${theme.color.grey1};
`

export default function MetricsPane(props) {
  const { displayedProjects, showMetricsPane, setShowMetricsPane } = props
  const [numSites, setNumSites] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [yearRange, setYearRange] = useState('')
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(true)

  const isMobileView = () => window.innerWidth <= mobileWidthThreshold
  const isDesktopView = () => !isMobileView()

  const calculateMetrics = useMemo(() => {
    let sites = new Set()
    let transects = 0
    let countries = new Set()
    let years = new Set()

    displayedProjects.forEach((project) => {
      project.records.forEach((record) => {
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

  return (
    <StyledMetricsWrapper showMetricsPane={showMetricsPane}>
      {isMobileView() || showMetricsPane ? (
        <SummarizedMetrics isDesktopView={isDesktopView()}>
          <MetricsCard>
            <H4>{displayedProjects.length}</H4>
            <H3>Projects </H3>
          </MetricsCard>
          <SitesAndTransectsContainer>
            <MetricsCard>
              <H4>{numSites}</H4>
              <H3>Sites</H3>
            </MetricsCard>
            <MetricsCard>
              <H4>{numTransects}</H4>
              <H3>Transects</H3>
            </MetricsCard>
          </SitesAndTransectsContainer>
          {isDesktopView() ? (
            <MetricsCard>
              <H3>{yearRange}</H3>
            </MetricsCard>
          ) : null}

          <MetricsCard>
            <H4>{numUniqueCountries}</H4>
            <H3>{numUniqueCountries === 1 ? 'Country' : 'Countries'}</H3>
          </MetricsCard>
        </SummarizedMetrics>
      ) : null}
      {isMobileView() && showMobileExpandedMetricsPane ? (
        <MobileExpandedMetricsPane>Placeholder: more metrics here</MobileExpandedMetricsPane>
      ) : null}
      {isDesktopView() ? (
        <DesktopToggleMetricsPaneButton onClick={handleShowMetricsPane}>
          {showMetricsPane ? String.fromCharCode(10095) : String.fromCharCode(10094)}{' '}
        </DesktopToggleMetricsPaneButton>
      ) : (
        <MobileExpandMetricsPaneButton onClick={handleShowMobileExpandedMetricsPane}>
          {showMobileExpandedMetricsPane ? String.fromCharCode(8964) : String.fromCharCode(8963)}
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
}
