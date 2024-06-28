import { useEffect, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import Header from './Header/Header'
import { useAuth0 } from '@auth0/auth0-react'
import LeafletMap from './LeafletMap'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import FilterPane from './FilterPane'
import LoadingIndicator from './LoadingIndicator'
import ViewToggle from './ViewToggle'
import TableView from './TableView'
import { useLocation, useNavigate } from 'react-router-dom'

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
  width: 35%;
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

const StyledTableContainer = styled('div')`
  flex-grow: 1;
  width: 100%;
  overflow: auto;
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

const mobileWidthThreshold = 960

export default function MermaidDash() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [projectData, setProjectData] = useState({})
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [hiddenProjects, setHiddenProjects] = useState([])
  const [view, setView] = useState('mapView')
  const location = useLocation()
  const navigate = useNavigate()

  const fetchData = async (token = '') => {
    try {
      let nextPageUrl = `${import.meta.env.VITE_REACT_APP_MERMAID_API_ENDPOINT}?limit=300&page=1`

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
              count: data.count,
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

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get('view') === 'tableView' && window.innerWidth > mobileWidthThreshold) {
      setView('tableView')
      return
    }
    setView('mapView')
    queryParams.delete('view')
    updateURLParams(queryParams)
  }, [location.search, updateURLParams])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= mobileWidthThreshold) {
        setView('mapView')
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        {window.innerWidth <= mobileWidthThreshold || view === 'mapView' ? (
          <StyledMapContainer>
            <LeafletMap displayedProjects={displayedProjects} />
          </StyledMapContainer>
        ) : (
          <StyledTableContainer>
            <TableView displayedProjects={displayedProjects} />
          </StyledTableContainer>
        )}
        <StyledMetricsContainer>Metrics</StyledMetricsContainer>
        <LoadingIndicator projectData={projectData} />
        {window.innerWidth > mobileWidthThreshold ? (
          <ViewToggle view={view} setView={setView} displayedProjects={displayedProjects} />
        ) : null}
      </StyledContentContainer>
    </StyledDashboardContainer>
  )
}
