import { useState, useEffect } from 'react'
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
  const [yearRange, setYearRange] = useState('')
  const [numUniqueCountries, setNumUniqueCountries] = useState(0)

  useEffect(() => {
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
    let sortedYears = Array.from(years).sort()
    setNumSites(sites.size)
    setNumTransects(transects)
    setNumUniqueCountries(countries.size)
    if (sortedYears.length === 0) {
      setYearRange('No data to obtain year range')
    } else if (sortedYears.length === 1) {
      setYearRange(`Showing data from ${sortedYears[0]}`)
    } else {
      setYearRange(`Showing data from ${sortedYears[0]} to ${sortedYears[sortedYears.length - 1]}`)
      return
    }
  }, [displayedProjects])

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
  displayedProjects: PropTypes.array.isRequired,
}
