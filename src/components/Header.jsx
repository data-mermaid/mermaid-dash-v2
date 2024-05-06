import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { AppBar, Toolbar, Box, IconButton, Button, Link, Menu, MenuItem } from '@mui/material'
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
    color: 'white',
  },
  menuShareViewBtn: {
    margin: 15,
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 100,
    padding: 6,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'orange',
      color: 'white',
    },
  },
  logoContainer: {
    flexGrow: 1,
    marginTop: 5,
    marginLeft: 5,
  },
  mermaidLogo: {
    width: 150,
  },
  userPicture: {
    borderRadius: '50%',
    marginRight: 10,
  },
}))

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [anchorEl, setAnchorEl] = useState(null)
  const userMenuOpen = Boolean(anchorEl)
  const classes = headerStyles()

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleLogoutUser = () => {
    handleCloseUserMenu()
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return (
    <AppBar className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} className={classes.logoContainer}>
          <img src={MermaidLogo} alt="Mermaid Logo" className={classes.mermaidLogo} />
        </Box>
        <Link href="#" className={classes.menuItem}>
          Launch MERMAID
        </Link>
        <Button className={classes.menuShareViewBtn}>Share this view</Button>
        <IconButton size="large" color="inherit">
          <MenuIcon />
        </IconButton>
        {isAuthenticated ? (
          <>
            <Button onClick={handleUserMenu}>
              <img src={user.picture} alt="Profile" className={classes.userPicture} width="50" />
            </Button>
            <Menu open={userMenuOpen} anchorEl={anchorEl} onClose={handleCloseUserMenu}>
              <MenuItem>Logged in as {user.name}</MenuItem>
              <MenuItem onClick={handleLogoutUser}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button className={classes.menuItem} onClick={() => loginWithRedirect()}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
