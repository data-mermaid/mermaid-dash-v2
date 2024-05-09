import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Link,
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Login as LoginIcon } from '@mui/icons-material'
import MermaidLogo from '../styles/Icons/mermaid-dashboard-logo.svg'
import { color } from '../constants/theme'
import { useAuth0 } from '@auth0/auth0-react'
import theme from '../theme'
import ShareViewModal from './ShareViewModal'

const sxStyles = {
  menuList: {
    backgroundColor: color.mermaidDarkBlue,
  },
}

const headerStyles = makeStyles({
  appBarProperty: {
    position: 'fixed',
    background: color.mermaidDarkBlue,
    height: '6.5rem',
    justifyContent: 'center',
  },
  toolBarProperty: {
    padding: 0,
  },
  headerItem: {
    margin: '0.8rem',
    color: color.mermaidWhite,
    textDecoration: 'none',
    fontSize: theme.typography.defaultFontSize,
  },
  menuShareViewBtn: {
    margin: '0.8rem',
    backgroundColor: color.mermaidCallout,
    color: color.mermaidWhite,
    borderRadius: '1.5rem',
    padding: theme.spacing.buttonPadding,
    textTransform: 'none',
    width: '16rem',
    fontSize: theme.typography.defaultFontSize,
    '&:hover': {
      backgroundColor: color.mermaidCallout,
      color: color.mermaidWhite,
    },
  },
  logoContainer: {
    flexGrow: 1,
    marginTop: theme.spacing.small,
    marginLeft: theme.spacing.small,
  },
  mermaidLogo: {
    width: 150,
  },
  userPicture: {
    borderRadius: '50%',
    marginRight: theme.spacing.medium,
  },
  overflowIcon: {
    fontSize: '4rem',
  },
  overflowAnchor: {
    textDecoration: 'none',
    color: color.mermaidWhite,
    fontSize: theme.typography.defaultFontSize,
  },
  loginTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.mermaidWhite,
    fontSize: theme.typography.defaultIconSize,
  },
  dropdownMenuItem: {
    justifyContent: 'flex-end',
    color: color.mermaidWhite,
    fontSize: theme.typography.defaultFontSize,
  },
})

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
          <Link
            href="https://datamermaid.org/terms-of-service/"
            target="_blank"
            className={classes.overflowAnchor}
          >
            Privacy
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <Link
            href="https://datamermaid.org/contact-us/"
            target="_blank"
            className={classes.overflowAnchor}
          >
            Contact Us
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <Link href="#" target="_blank" className={classes.overflowAnchor}>
            Data Disclaimer
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseOverflowMenu} className={classes.dropdownMenuItem}>
          <Link href="#" target="_blank" className={classes.overflowAnchor}>
            Dashboard Stories
          </Link>
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
        <ShareViewModal />
        <IconButton
          size="large"
          className={classes.overflowIcon}
          color="inherit"
          onClick={handleOverflowMenu}
        >
          {overflowMenuOpen ? (
            <CloseIcon className={classes.overflowIcon} />
          ) : (
            <MenuIcon className={classes.overflowIcon} />
          )}
        </IconButton>
        {renderOverflowMenu()}
        {isAuthenticated ? (
          <>
            <Button onClick={handleUserMenu}>
              <img src={user.picture} alt="Profile" className={classes.userPicture} width="40" />
            </Button>
            f
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
              <LoginIcon fontSize="large" />
              <Typography variant="h6">Login</Typography>
            </div>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
