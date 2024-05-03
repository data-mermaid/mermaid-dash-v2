import { useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { AppBar, Toolbar, Box, Typography, IconButton, Button } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import MermaidLogo from '../styles/Icons/mermaid-dashboard-logo.svg'
import { color } from '../constants/theme'
import { useAuth0 } from '@auth0/auth0-react'

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
  userPicture: {
    borderRadius: '50%',
    marginRight: 10,
  },
}))

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  console.log('user', user)
  console.log('isAuthenticated', isAuthenticated)
  const classes = headerStyles()

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })

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
        {!isAuthenticated && (
          <Button className={classes.menuItem} onClick={() => loginWithRedirect()}>
            Login
          </Button>
        )}
        {isAuthenticated && (
          <>
            <img src={user.picture} alt="Profile" className={classes.userPicture} width="50" />
            <Typography>{user.name}</Typography>
            <Button className={classes.menuItem} onClick={() => logoutWithRedirect()}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
