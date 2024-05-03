import { makeStyles } from '@mui/styles'
import { AppBar, Toolbar, Box, IconButton, Link, Button } from '@mui/material'
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
}))

const Header = () => {
  const classes = headerStyles()

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
        <Link href="#" className={classes.menuItem}>
          Login
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default Header
