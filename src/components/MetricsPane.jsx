import { useEffect, useState, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { mediaQueryTabletLandscapeOnly, hoverState } from '../styles/mediaQueries'
import theme from '../theme'
import { ButtonSecondary } from './generic/buttons'

const mobileWidthThreshold = 960

const StyledMetricsWrapper = styled('div')`
  ${(props) => props.showMetricsPane === true && 'min-width: 35rem;'}
  position: relative;
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    z-index: 5;
    background-color: transparent;
    width: 90%;
    bottom: ${(props) => (props.showLoadingIndicator ? '5rem;' : '0.5rem;')}
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    ${(props) => props.showMobileExpandedMetricsPane && 'top: 7.9rem;'}
    ${(props) => props.showMobileExpandedMetricsPane && 'width: 100vw;'}
    ${(props) => props.showMobileExpandedMetricsPane && 'bottom: 0;'}
  `)}
`

const SummarizedMetrics = styled('div')`
  width: 100%;
  overflow-y: scroll;
  ${window.innerWidth > mobileWidthThreshold && 'height: calc(100vh - 10rem);'}
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
    overflow-y: hidden;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 0;
    ${(props) =>
      props.showMobileExpandedMetricsPane ? 'align-items: flex-start;' : 'align-items: flex-end;'}
    ${(props) => props.showMobileExpandedMetricsPane && `background-color: ${theme.color.grey1};`}
    height: ${(props) => (props.showLoadingIndicator ? '6.7rem;' : '11.2rem;')}
  `)}
`

const DesktopToggleMetricsPaneButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  left: -4rem;
  height: 6rem;
  z-index: 5;
  width: 4rem;
  border: none;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

const MobileExpandMetricsPaneButton = styled(ButtonSecondary)`
  display: none;
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: ${theme.typography.largeIconSize};
    display: block;
    position: absolute;
    top: -5rem;
    justify-self: center;
    background-color: transparent;
    border: none;
    color: ${theme.color.white};
    ${(props) => props.showMobileExpandedMetricsPane && `background-color: ${theme.color.grey1};`}
    ${(props) => props.showMobileExpandedMetricsPane && 'width: 100vw;'}
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
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
    height: 100%;
  `)}
`

const MetricsCard = styled('div')`
  background-color: ${theme.color.white};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    margin: 0;
    width: auto;
    flex-grow: 1;
    height: 100%;
  `)}
`

const H3 = styled('h3')`
  padding: 0;
  margin: 0.5rem;
`

const P = styled('p')`
  padding: 0;
  margin: 0.5rem;
  font-size: ${theme.typography.defaultFontSize};
`

const MobileExpandedMetricsPane = styled('div')`
  background-color: ${theme.color.grey1};
  height: calc(100vh - 14rem);
  width: 100vw;
`

export default function MetricsPane(props) {
  const { displayedProjects, showMetricsPane, setShowMetricsPane, showLoadingIndicator } = props
  const [numSites, setNumSites] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [yearRange, setYearRange] = useState('')
  const [showMobileExpandedMetricsPane, setShowMobileExpandedMetricsPane] = useState(false)

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
      showMetricsPane={showMetricsPane}
      showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
      showLoadingIndicator={showLoadingIndicator}
    >
      {window.innerWidth <= mobileWidthThreshold || showMetricsPane ? (
        <SummarizedMetrics
          isDesktopView={window.innerWidth > mobileWidthThreshold ? true : false}
          onClick={handleMobileSummarizedMetricsClick}
          showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
          showLoadingIndicator={showLoadingIndicator}
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
          {window.innerWidth > mobileWidthThreshold ? (
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
      {window.innerWidth <= mobileWidthThreshold && showMobileExpandedMetricsPane ? (
        <MobileExpandedMetricsPane>Placeholder: more metrics here</MobileExpandedMetricsPane>
      ) : null}
      {window.innerWidth > mobileWidthThreshold ? (
        <DesktopToggleMetricsPaneButton onClick={handleShowMetricsPane}>
          {showMetricsPane ? String.fromCharCode(10095) : String.fromCharCode(10094)}{' '}
        </DesktopToggleMetricsPaneButton>
      ) : (
        <MobileExpandMetricsPaneButton
          onClick={handleShowMobileExpandedMetricsPane}
          showMobileExpandedMetricsPane={showMobileExpandedMetricsPane}
        >
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
  showLoadingIndicator: PropTypes.bool.isRequired,
}
