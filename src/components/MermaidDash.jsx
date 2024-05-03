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
    margin: '0 -7px',
  },
  filterContainer: {
    border: '1px solid red',
    width: '300px',
  },
  mapContainer: {
    border: '1px solid blue',
    flexGrow: 1,
  },
  metricsContainer: {
    border: '1px solid green',
    width: '300px',
    position: 'absolute',
    right: 15,
    top: '65px',
    height: 'calc(100vh - 90px)',
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
      top: 'calc(80% - 45px)',
      height: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
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
