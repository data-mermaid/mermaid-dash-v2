import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import Header from './Header/Header'
import { useAuth0 } from '@auth0/auth0-react'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'

const StyledDashboardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);
`

const StyledContentContainer = styled('div')`
  display: flex;
  flex-direction: row;
  margin-top: 4.9rem;
  flex-grow: 1;
`

const StyledFilterContainer = styled('div')`
  border: 1px solid red;
  width: 30rem;
  ${mediaQueryTabletLandscapeOnly(css`
    border: 1px solid red;
    width: 80%;
    position: absolute;
    top: 10%;
    height: 80%;
    left: 50%;
    transform: translateX(-50%);
  `)}
`

const StyledMapContainer = styled('div')`
  border: 1px solid blue;
  flex-grow: 1;
`

const StyledMetricsContainer = styled('div')`
  border: 1px solid green;
  width: 30rem;
  position: absolute;
  right: 1.5rem;
  top: 8rem;
  height: calc(100vh - 10rem);
  ${mediaQueryTabletLandscapeOnly(css`
    border: 1px solid green;
    width: 90%;
    top: calc(80% - 4.5rem);
    height: 20%;
    left: 50%;
    transform: translateX(-50%);
  `)}
`

export default function MermaidDash() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const fetchData = async (token = '') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT}?limit=100&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        console.log(token ? 'With token Response.json():' : 'Response.json():', data)
      } else {
        console.error('Failed to fetch data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      fetchData()
    } else {
      getAccessTokenSilently()
        .then((token) => fetchData(token))
        .catch((error) => console.error('Error getting access token:', error))
    }
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <StyledDashboardContainer>
      <Header />
      <StyledContentContainer>
        <StyledFilterContainer>Filters</StyledFilterContainer>
        <StyledMapContainer>Map</StyledMapContainer>
        <StyledMetricsContainer>Metrics</StyledMetricsContainer>
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}
