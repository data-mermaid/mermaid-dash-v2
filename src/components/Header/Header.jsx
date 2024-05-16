import { Link } from 'react-router-dom'
import { useState } from 'react'
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
  UserMenuLinkThatLooksLikeButton,
  UserLoginContainer,
  HeaderLoginText,
  AvatarWrapper,
  CurrentUserImg,
  BiggerIconUser,
  LoggedInAs,
} from './Header.styles'
import HideShow from '../HideShow/HideShow'
import { BiggerHamburgerIcon } from './Header.styles'
import { LoginIcon, IconDown } from '../icons'

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [hasImageError, setHasImageError] = useState(false)

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

  const GlobalLinks = () => {
    return (
      <>
        <StyledNavLink href={import.meta.env.VITE_REACT_APP_MERMAID_DASHBOARD_LINK} target="_blank">
          Launch MERMAID
        </StyledNavLink>
        <ShareViewModal />
      </>
    )
  }

  const renderOverflowMenu = () => {
    return (
      <UserMenu>
        <UserMenuLinkThatLooksLikeButton
          href="https://datamermaid.org/terms-of-service/"
          target="_blank"
        >
          Privacy
        </UserMenuLinkThatLooksLikeButton>
        <UserMenuLinkThatLooksLikeButton href="https://datamermaid.org/contact-us/" target="_blank">
          Contact Us
        </UserMenuLinkThatLooksLikeButton>
        <UserMenuButton>Data Disclaimer</UserMenuButton>
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
    // Avatar with user image
    if (user && user.picture && !hasImageError) {
      return (
        <AvatarWrapper>
          <CurrentUserImg src={user.picture} alt="" onError={handleImageError} />
        </AvatarWrapper>
      )
    }

    // Avatar with fallback image
    if (user && user.picture && hasImageError) {
      return (
        <AvatarWrapper>
          <BiggerIconUser />
        </AvatarWrapper>
      )
    }

    // First name
    if (user && user.first_name) {
      return (
        <AvatarWrapper>
          {user && user.first_name} <IconDown />
        </AvatarWrapper>
      )
    }

    // Full name
    if (user && user.full_name) {
      return (
        <AvatarWrapper>
          {user && user.full_name} <IconDown />
        </AvatarWrapper>
      )
    }

    // User icon
    return (
      <AvatarWrapper>
        <BiggerIconUser />
      </AvatarWrapper>
    )
  }

  const getUserDisplayName = () => {
    if (user?.given_name) {
      return user.given_name
    }

    if (user?.name) {
      return user.name
    }

    return user.email
  }

  return (
    <StyledHeader>
      <Link to="https://collect.datamermaid.org">
        <LogoImg src={MermaidLogo} alt="MERMAID Logo" />
      </Link>
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
        </div>
      </GlobalNav>
    </StyledHeader>
  )
}

export default Header
