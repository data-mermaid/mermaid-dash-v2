import { makeStyles } from '@mui/styles'
import { AppBar, Toolbar, Box, Typography, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import MermaidLogo from '../styles/Icons/mermaid-dashboard-logo.svg'
import { color } from '../constants/theme'

const headerStyles = makeStyles(() => ({
  appBarProperty: {
    position: 'fixed',
    background: color.mermaidDarkBlue,
    height: 49,
    justifyContent: 'center',
  },
  toolBarProperty: {
    padding: 0,
  },
  menuItem: {
    margin: 10,
  },
  menuShare: {
    margin: 15,
    backgroundColor: 'orange',
    borderRadius: 100,
    padding: 6,
  },
}))

const Header = () => {
  const classes = headerStyles()
  // const introModalStage = JSON.parse(window.sessionStorage.getItem('intro')) !== false
  // const [modalStageOpen, setModalStage] = useState(introModalStage)
  // const [anchorEl, setAnchorEl] = useState(null)

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  // const modalToggleHandler = () => {
  //   setModalStage(!modalStageOpen)
  //   window.sessionStorage.setItem('intro', !modalStageOpen)
  //   if (!modalStageOpen) {
  //     setAnchorEl(null)
  //   }
  // }

  return (
    <AppBar className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} flexGrow={1} marginTop="5px" marginLeft="5px">
          <img src={MermaidLogo} alt="Mermaid Logo" style={{ width: '150px' }} />
        </Box>
        {/* <IntroModal open={modalStageOpen} modalToggleHandler={modalToggleHandler} /> */}
        <Typography className={classes.menuItem}>Launch MERMAID</Typography>
        <Typography className={classes.menuShare}>Share this view </Typography>
        <IconButton size="large" color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography className={classes.menuItem}>Login</Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
