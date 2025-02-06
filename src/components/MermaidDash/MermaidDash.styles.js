import styled, { css } from 'styled-components'
import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import theme from '../../styles/theme'
import { IconFilter } from '../../assets/icons'
import { ButtonPrimary, ButtonSecondary } from '../generic'

export const StyledDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
`

export const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${theme.spacing.headerHeight};
  flex-grow: 1;
  overflow: hidden;
`

export const StyledFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 40rem;
  ${(props) => props.$showFilterPane && 'width: 50%;'}
  ${mediaQueryTabletLandscapeOnly(css`
    z-index: 400;
    background-color: ${theme.color.grey1};
    overflow-y: scroll;
    width: ${(props) => (props.$showFilterPane ? '80%' : '0%')};
    position: absolute;
    top: 10%;
    height: ${(props) => (props.$showFilterPane ? '80%' : '0%')};
    left: 50%;
    transform: translateX(-50%);
  `)}
`

export const StyledFilterContainer = styled.div`
  z-index: 2;
  overflow-y: scroll;
  height: calc(100dvh - 5rem);
  width: 100%;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

export const StyledMapContainer = styled.div`
  flex-grow: 2;
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  display: grid;
`

export const StyledTableContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  position: relative;
`

export const BiggerFilterIcon = styled(IconFilter)`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.3rem;
  position: relative;
`

export const DesktopToggleFilterPaneButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  right: -4rem;
  height: 4rem;
  z-index: 5;
  width: 4rem;
  border: none;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

export const StyledMobileToggleFilterPaneButton = styled(ButtonSecondary)`
  position: absolute;
  display: none;
  height: 6rem;
  width: 6rem;
  ${mediaQueryTabletLandscapeOnly(css`
    display: block;
    top: calc(${theme.spacing.headerHeight} + 1rem);
    left: 0.5rem;
    z-index: 5;
  `)};
`

export const StyledMobileZoomToDataButton = styled(ButtonSecondary)`
  position: absolute;
  display: none;
  height: 6rem;
  width: 6rem;
  line-height: 0;
  ${mediaQueryTabletLandscapeOnly(css`
    display: block;
    top: calc(${theme.spacing.headerHeight} + 1rem);
    left: 7rem;
    z-index: 5;
  `)};
`

export const StyledMobileFollowMapButton = styled(ButtonSecondary)`
  position: absolute;
  display: none;
  height: 6rem;
  width: 6rem;
  line-height: 0;
  ${mediaQueryTabletLandscapeOnly(css`
    display: block;
    background-color: ${({ enableFollowScreen }) =>
      enableFollowScreen ? theme.color.secondaryColor : theme.color.white};
    top: calc(${theme.spacing.headerHeight} + 1rem);
    right: 0.5rem;
    z-index: 5;
  `)};
`

export const MobileCloseFilterPaneButton = styled(ButtonSecondary)`
  display: block;
  cursor: pointer;
  width: calc(100% - 2rem);
  margin: 1rem;
`

export const MobileFooterContainer = styled.div`
  background-color: ${theme.color.grey1};
  margin: -1rem;
  padding-left: 2rem;
`

export const StyledChevronSpan = styled.span`
  padding-right: 0.8rem;
`

export const FilterDownloadWrapper = styled.div`
  display: flex;
  gap: 1px;
  background: white;
  margin: 10px;
  height: 40px;
  z-index: 2;
  border: 1px solid ${theme.color.grey0};
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.15);
`

export const FilterDownloadButton = styled(ButtonPrimary)`
  width: 90%;
  height: 100%;
  flex-grow: 1;
`

export const GFCRDataDownloadButton = styled(ButtonPrimary)`
  height: 100%;
`

export const DownloadMenu = styled.div`
  position: absolute;
  display: flex;
  color: ${theme.color.white};
  flex-direction: column;
  align-items: flex-end;
  bottom: 38px;
  width: 220px;
  left: -183px;
`
