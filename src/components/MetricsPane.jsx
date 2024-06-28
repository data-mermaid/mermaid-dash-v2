import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
`

const SitesAndTransectsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export default function MetricsPane(props) {
  const { displayedProjects } = props
  const [numSites, setNumSites] = useState(0)
  const [numTransects, setNumTransects] = useState(0)
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)
  const [yearRange, setYearRange] = useState('')

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

  return (
    <Container>
      <div>
        <span>Projects: {displayedProjects.length}</span>
      </div>
      <SitesAndTransectsContainer>
        <div>
          <span>Sites: {numSites}</span>
        </div>
        <div>
          <span>Transects: {numTransects}</span>
        </div>
      </SitesAndTransectsContainer>
      <div>
        <span>{yearRange}</span>
      </div>
      <div>
        <span>{numUniqueCountries} countries</span>
      </div>
    </Container>
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
}
