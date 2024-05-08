import { useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import Header from './Header'
import { useAuth0 } from '@auth0/auth0-react'

const useStyles = makeStyles(() => ({
  dashContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 2rem)',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '6.5rem',
    flexGrow: 1,
    margin: '0 -0.7rem',
  },
  filterContainer: {
    border: '1px solid red',
    width: '30rem',
  },
  mapContainer: {
    border: '1px solid blue',
    flexGrow: 1,
  },
  metricsContainer: {
    border: '1px solid green',
    width: '30rem',
    position: 'absolute',
    right: '1.5rem',
    top: '8rem',
    height: 'calc(100vh - 10rem)',
  },
  '@media (max-width: 1024px)': {
    filterContainer: {
      border: '1px solid red',
      width: '80%',
      position: 'absolute',
      top: '10%',
      height: '80%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    metricsContainer: {
      border: '1px solid green',
      width: '90%',
      top: 'calc(80% - 4.5rem)',
      height: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
}))

export default function MermaidDash() {
  const classes = useStyles()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const fetchData = async (token = '') => {
    try {
      const response = await fetch(
        'https://dev-api.datamermaid.org/v1/projectsummarysampleevent?limit=100&page=1',
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
    <div className={classes.dashContainer}>
      <Header />
      <div className={classes.contentContainer}>
        <div className={classes.filterContainer}>Filters</div>
        <div className={classes.mapContainer}>Map</div>
        <div className={classes.metricsContainer}>Metrics</div>
      </div>
    </div>
  )
}
