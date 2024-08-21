import { useState, useEffect } from 'react'
import MermaidLogo from '../../assets/mermaid-dashboard-logo.svg'
import { useAuth0 } from '@auth0/auth0-react'
import ShareViewModal from './components/ShareViewModal'
import {
  StyledHeader,
  LogoImg,
  GlobalNav,
  StyledNavLink,
  HeaderButtonThatLooksLikeLink,
  UserMenu,
  UserMenuButton,
  MenuLink,
  UserLoginContainer,
  HeaderLoginText,
  AvatarWrapper,
  CurrentUserImg,
  BiggerIconUser,
  LoggedInAs,
} from './Header.styles'
import HideShow from './components/HideShow'
import { BiggerHamburgerIcon } from './Header.styles'
import { LoginIcon } from '../../assets/dashboardOnlyIcons'
import { IconDown } from '../../assets/icons'
import { headerText, dataDisclaimer } from '../../constants/language'
import DataDisclaimer from './components/DataDisclaimer'

const Header = ({isLeafletMap = true, setIsLeafletMap}) => {
  const { user, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
  const [hasImageError, setHasImageError] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const _tryToAutomaticallyLoginUser = useEffect(() => {
    const silentAuth = async () => {
      try {
        await getAccessTokenSilently()
      } catch (error) {
        console.error('Silent authentication error:', error)
      }
    }
    if (!isAuthenticated) {
      silentAuth()
    }
  }, [isAuthenticated, getAccessTokenSilently, loginWithRedirect])

  const handleImageError = () => {
    setHasImageError(true)
  }

  const handleLogoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.href,
      },
    })
  }

  const handleOpenDisclaimer = () => {
    setShowDisclaimer(true)
  }
  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false)
  }

  const GlobalLinks = () => {
    return (
      <>
        <StyledNavLink href={import.meta.env.VITE_REACT_APP_MERMAID_DASHBOARD_LINK} target="_blank">
          {headerText.redirectDashboard}
        </StyledNavLink>
        <ShareViewModal />
      </>
    )
  }

  const renderOverflowMenu = () => {
    return (
      <UserMenu>
        <UserMenuButton>Dashboard Highlights</UserMenuButton>
        <UserMenuButton onClick={handleOpenDisclaimer}>{dataDisclaimer.title}</UserMenuButton>
        <MenuLink href="https://datamermaid.org/terms-of-service/" target="_blank">
          Data Protection and Privacy
        </MenuLink>
        <MenuLink href="https://datamermaid.org/contact-us/" target="_blank">
          Contact Us
        </MenuLink>
        <UserMenuButton onClick={() => setIsLeafletMap(!isLeafletMap)}>
          Switch to {isLeafletMap ? 'maplibre' : 'leaflet'} map
        </UserMenuButton>
      </UserMenu>
    )
  }

  const UserAccountMenu = () => {
    return (
      <UserMenu>
        {user && <LoggedInAs>Logged in as {getUserDisplayName()}</LoggedInAs>}
        <UserMenuButton onClick={handleLogoutUser}>Logout</UserMenuButton>
      </UserMenu>
    )
  }

  const getUserButton = () => {
    let avatarContent
    if (user?.picture && !hasImageError) {
      avatarContent = <CurrentUserImg src={user.picture} alt="" onError={handleImageError} />
    } else if (user?.picturer && hasImageError) {
      avatarContent = <BiggerIconUser />
    } else if (user?.first_name || user?.full_name) {
      avatarContent = `${user?.first_name || user?.full_name} ${(<IconDown />)}`
    } else {
      avatarContent = <BiggerIconUser />
    }

    return <AvatarWrapper>{avatarContent}</AvatarWrapper>
  }

  const getUserDisplayName = () => {
    return user?.first_name || user?.full_name || user.email
  }

  const handleLogin = () => {
    loginWithRedirect({ appState: { returnTo: location.search } })
  }

  return (
    <StyledHeader>
      <LogoImg src={MermaidLogo} alt="MERMAID Logo" />
      <GlobalNav>
        <div className="desktop">
          <GlobalLinks />
          <HideShow
            button={
              <HeaderButtonThatLooksLikeLink>
                <BiggerHamburgerIcon />
              </HeaderButtonThatLooksLikeLink>
            }
            contents={renderOverflowMenu()}
          />
          {isAuthenticated ? (
            <HideShow
              closeOnClickWithin={true}
              button={getUserButton()}
              contents={UserAccountMenu()}
            />
          ) : (
            <HeaderButtonThatLooksLikeLink onClick={handleLogin}>
              <UserLoginContainer>
                <LoginIcon />
                <HeaderLoginText>Login</HeaderLoginText>
              </UserLoginContainer>
            </HeaderButtonThatLooksLikeLink>
          )}
          <DataDisclaimer
            showDisclaimer={showDisclaimer}
            handleCloseDisclaimer={handleCloseDisclaimer}
          />
        </div>
      </GlobalNav>
    </StyledHeader>
  )
}

export default Header
