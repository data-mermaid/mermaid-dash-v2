import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MermaidLogo from '../../styles/Icons/mermaid-dashboard-logo.svg'
import { useAuth0 } from '@auth0/auth0-react'
import ShareViewModal from '../ShareViewModal'
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
import HideShow from '../HideShow/HideShow'
import { BiggerHamburgerIcon } from './Header.styles'
import { LoginIcon } from '../dashboardOnlyIcons'
import { IconDown } from '../icons'
import { headerText, dataDisclaimer } from '../../constants/language'
import DataDisclaimer from '../DataDisclaimer'

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
  const [hasImageError, setHasImageError] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  useEffect(() => {
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
        returnTo: window.location.origin,
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
        <MenuLink href="https://datamermaid.org/terms-of-service/" target="_blank">
          Privacy
        </MenuLink>
        <MenuLink href="https://datamermaid.org/contact-us/" target="_blank">
          Contact Us
        </MenuLink>
        <UserMenuButton onClick={handleOpenDisclaimer}>{dataDisclaimer.title}</UserMenuButton>
        <UserMenuButton>Dashboard Stories</UserMenuButton>
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
            <HeaderButtonThatLooksLikeLink onClick={loginWithRedirect}>
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
