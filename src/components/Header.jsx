import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
  Link,
  Menu,
  MenuItem,
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Login as LoginIcon } from '@mui/icons-material'
import MermaidLogo from '../styles/Icons/mermaid-dashboard-logo.svg'
import { color } from '../constants/theme'
import { useAuth0 } from '@auth0/auth0-react'

const sxStyles = {
  menuList: {
    backgroundColor: color.mermaidDarkBlue,
  },
}

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
  headerItem: {
    margin: 8,
    color: color.mermaidWhite,
    textDecoration: 'none',
  },
  menuShareViewBtn: {
    margin: 8,
    backgroundColor: color.mermaidCallout,
    color: color.mermaidWhite,
    borderRadius: '1.5rem',
    padding: '6px 20px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: color.mermaidCallout,
      color: color.mermaidWhite,
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
  overflowAnchor: {
    textDecoration: 'none',
    color: color.mermaidWhite,
  },
  loginTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.mermaidWhite,
  },
  dropdownMenuItem: {
    justifyContent: 'flex-end',
    color: color.mermaidWhite,
    fontWeight: '600',
  },
}))

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const [overflowAnchorEl, setOverflowAnchorEl] = useState(null)
  const userMenuOpen = Boolean(userMenuAnchorEl)
  const overflowMenuOpen = Boolean(overflowAnchorEl)
  const classes = headerStyles()

  const handleUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null)
  }

  const handleLogoutUser = () => {
    handleCloseUserMenu()
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  const handleOverflowMenu = (event) => {
    setOverflowAnchorEl(event.currentTarget)
  }

  const handleCloseOverflowMenu = () => {
    setOverflowAnchorEl(null)
  }

  const renderOverflowMenu = () => {
    return (
      <Menu
        open={overflowMenuOpen}
        anchorEl={overflowAnchorEl}
        onClose={handleCloseOverflowMenu}
        MenuListProps={{ sx: sxStyles.menuList }}
      >
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <a
            href="https://datamermaid.org/terms-of-service/"
            target="_blank"
            className={classes.overflowAnchor}
          >
            Privacy
          </a>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <a
            href="https://datamermaid.org/contact-us/"
            target="_blank"
            className={classes.overflowAnchor}
          >
            Contact Us
          </a>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <a href="#" target="_blank" className={classes.overflowAnchor}>
            Data Disclaimer
          </a>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <a href="#" target="_blank" className={classes.overflowAnchor}>
            Dashboard Stories
          </a>
        </MenuItem>
      </Menu>
    )
  }

  return (
    <AppBar className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} className={classes.logoContainer}>
          <img src={MermaidLogo} alt="Mermaid Logo" className={classes.mermaidLogo} />
        </Box>
        <Link
          href="https://collect.datamermaid.org"
          variant="body1"
          target="_blank"
          className={classes.headerItem}
        >
          Launch MERMAID
        </Link>
        <Button className={classes.menuShareViewBtn}>Share this view</Button>
        <IconButton size="large" color="inherit" onClick={handleOverflowMenu}>
          {overflowMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        {renderOverflowMenu()}
        {isAuthenticated ? (
          <>
            <Button onClick={handleUserMenu}>
              <img src={user.picture} alt="Profile" className={classes.userPicture} width="40" />
            </Button>
            <Menu
              open={userMenuOpen}
              anchorEl={userMenuAnchorEl}
              onClose={handleCloseUserMenu}
              MenuListProps={{ sx: sxStyles.menuList }}
            >
              <MenuItem className={classes.dropdownMenuItem}>Logged in as {user.name}</MenuItem>
              <MenuItem onClick={handleLogoutUser} className={classes.dropdownMenuItem}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button className={classes.menuItem} onClick={() => loginWithRedirect()}>
            <div className={classes.loginTextContainer}>
              <LoginIcon fontSize="small" />
              <Typography variant="body2">Login</Typography>
            </div>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
