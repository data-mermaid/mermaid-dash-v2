import { makeStyles } from '@mui/styles'
import Header from './Header'

const useStyles = makeStyles(() => ({
  dashContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 20px)',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '44px',
    flexGrow: 1,
  },
  filterContainer: {
    flexGrow: 2,
  },
  mapContainer: {
    flexGrow: 5,
  },
  metricsContainer: {
    flexGrow: 2,
  },
}))

export default function MermaidDash() {
  const classes = useStyles()
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
