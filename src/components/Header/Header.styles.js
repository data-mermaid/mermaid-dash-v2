import styled, { css } from 'styled-components'
import { HamburgerMenu } from '../../styles/Icons/dashboardOnlyIcons'
import { IconUser } from '../../styles/Icons/icons'
import theme from '../../styles/theme'
import { ButtonThatLooksLikeLink } from '../generic'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'

export const StyledHeader = styled('header')`
  background-color: ${theme.color.headerColor};
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  color: ${theme.color.white};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 102;
  height: ${theme.spacing.headerHeight};
`
export const AvatarWrapper = styled('button')`
  cursor: pointer;
  height: ${theme.spacing.headerHeight};
  width: ${theme.spacing.headerHeight};
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: none;
  border: none;
`

export const CurrentUserImg = styled('img')`
  height: calc(${theme.spacing.headerHeight} - 10px);
  width: calc(${theme.spacing.headerHeight} - 10px);
  border-radius: 50%;
  ${hoverState(css`
    outline: solid 3px ${theme.color.callout};
  `)};
  ${mediaQueryTabletLandscapeOnly(css`
    height: calc(${theme.spacing.headerHeight} - 15px);
    margin-top: 7px;
  `)}
`

export const LogoImg = styled('img')`
  height: calc(${theme.spacing.headerHeight} - 10px);
  padding: 0 ${theme.spacing.small};
  margin-top: 5px;
  ${mediaQueryTabletLandscapeOnly(css`
    height: calc(${theme.spacing.headerHeight} - 15px);
    margin-top: 7px;
  `)}
`

const linkStyles = css`
  color: ${theme.color.white};
  cursor: pointer;
  white-space: nowrap;
  height: ${theme.spacing.headerHeight};
  border-bottom: solid ${theme.spacing.borderLarge} transparent;
  text-decoration: none;
  position: relative;
  margin: 0 ${theme.spacing.small};
  display: inline-block;
  padding: 0;
  line-height: ${theme.spacing.headerHeight};
  ${hoverState(css`
    border-bottom: solid 3px ${theme.color.callout};
  `)}
`

export const HeaderButtonThatLooksLikeLink = styled(ButtonThatLooksLikeLink)`
  ${linkStyles}
`

export const StyledNavLink = styled('a')`
${linkStyles}
${(props) =>
  props.$disabledLink &&
  css`
    color: ${theme.color.disabledText};
    pointer-events: none;
  `}
  }
  display: flex;
  `
export const MenuLink = styled(StyledNavLink)`
  ${linkStyles}
  border-width: 0 0 3px 0;
  background: none;
  display: inline-block;
`

export const UserMenu = styled('div')`
  position: absolute;
  top: ${theme.spacing.headerHeight};
  right: 0;
  background-color: ${theme.color.headerDropdownMenuBackground};
  color: ${theme.color.white};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: ${theme.spacing.medium};
`

export const LoggedInAs = styled('p')`
  color: inherit;
  white-space: nowrap;
  opacity: 0.7;
`

export const GlobalNav = styled('nav')`
  .desktop {
    display: flex;
  }
  .mobile {
    display: none;
  }
  ${mediaQueryTabletLandscapeOnly(css`
    .desktop {
      display: none;
    }
    .mobile {
      display: flex;
    }
  `)}
`

export const ShareViewButton = styled.button`
  margin: 0.8rem;
  background-color: ${theme.color.callout};
  color: ${theme.color.white};
  border-radius: 1.5rem;
  border: 0;
  padding: ${theme.spacing.buttonPadding};
  width: 16rem;
  &:hover {
    cursor: pointer;
  },
`

export const UserMenuButton = styled.button`
  ${linkStyles}
  border-width: 0 0 3px 0;
  background: none;
  display: inline-block;
`
const biggerIcons = css`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.7rem;
  position: relative;
`

export const BiggerHamburgerIcon = styled(HamburgerMenu)`
  ${biggerIcons}
`

export const BiggerIconUser = styled(IconUser)`
  ${biggerIcons}
  color: white;
  position: inherit;
`

export const UserLoginContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-top: ${theme.spacing.small};
`

export const HeaderLoginText = styled('span')`
  font-size: ${theme.typography.smallFontSize};
  line-height: 1;
`

export const ShareViewModalContainer = styled('div')`
  display: flex;
  flex-direction: column;
  position: 'absolute';
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600;
  border: 2px solid #000;
  boxshadow: 24;
`
