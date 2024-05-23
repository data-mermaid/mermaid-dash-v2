import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Header from './Header/Header'
import { useAuth0 } from '@auth0/auth0-react'
import LeafletMap from './LeafletMap'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import FilterPane from './FilterPane'

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
  z-index: 2;
  overflow-y: scroll;
  height: calc(100vh - 5rem);
  ${mediaQueryTabletLandscapeOnly(css`
    width: 80%;
    position: absolute;
    top: 10%;
    height: 80%;
    left: 50%;
    transform: translateX(-50%);
  `)}
`

const StyledMapContainer = styled('div')`
  flex-grow: 1;
  height: calc(100%-90px);
  width: 100%;
  z-index: 1;
`

const StyledMetricsContainer = styled('div')`
  border: 1px solid green;
  width: 30rem;
  position: absolute;
  right: 1.5rem;
  top: 8rem;
  height: calc(100vh - 10rem);
  z-index: 2;
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
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [projectData, setProjectData] = useState({})
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [hiddenProjects, setHiddenProjects] = useState([])

  const fetchData = async (token = '') => {
    try {
      let nextPageUrl = `${import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT}?limit=10&page=1`

      while (nextPageUrl !== null) {
        const response = await fetch(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProjectData((prevData) => {
            return {
              ...prevData,
              next: data.next,
              previous: data.previous,
              results: prevData.results
                ? [...prevData.results, ...data.results]
                : [...data.results],
            }
          })
          nextPageUrl = data.next
        } else {
          console.error('Failed to fetch data:', response.status)
          break
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      fetchData()
    } else {
      getAccessTokenSilently()
        .then((token) => fetchData(token))
        .catch((error) => console.error('Error getting access token:', error))
    }
  }, [isLoading, isAuthenticated, getAccessTokenSilently])

  return (
    <StyledDashboardContainer>
      <Header />
      <StyledContentContainer>
        <StyledFilterContainer>
          <FilterPane
            projectData={projectData}
            displayedProjects={displayedProjects}
            setDisplayedProjects={setDisplayedProjects}
            hiddenProjects={hiddenProjects}
            setHiddenProjects={setHiddenProjects}
          />
        </StyledFilterContainer>
        <StyledMapContainer>
          <LeafletMap displayedProjects={displayedProjects} />
        </StyledMapContainer>
        <StyledMetricsContainer>Metrics</StyledMetricsContainer>
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}
