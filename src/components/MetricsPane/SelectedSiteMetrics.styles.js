import styled, { css } from 'styled-components'

import {
  IconPersonCircle,
  IconTextBoxMultiple,
  IconCalendar,
  IconText,
  IconMapOutline,
  IconTable,
  IconQuoteOpen,
} from '../../assets/dashboardOnlyIcons'
import { IconClose, IconGlobe, IconSharing, IconUser } from '../../assets/icons'
import { Row } from '../generic/positioning'
import theme from '../../styles/theme'
import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'

export const SelectedSiteMetricsCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background-color: ${theme.color.white};
`

export const SelectedSiteContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25rem;

  & span {
    overflow-wrap: break-word;
  }
`

export const SelectedSiteContentContainerWiderOnMobile = styled(SelectedSiteContentContainer)`
  ${mediaQueryTabletLandscapeOnly(css`
    width: 100%;
  `)}
`
export const biggerIcons = css`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
  position: relative;
`

export const biggerIconsWithMargin = css`
  ${biggerIcons}
  margin-right: 0.8rem;
`

export const BiggerIconPersonCircle = styled(IconPersonCircle)`
  ${biggerIconsWithMargin}
`
export const BiggerIconTextBoxMultiple = styled(IconTextBoxMultiple)`
  ${biggerIconsWithMargin}
`

export const BiggerIconCalendar = styled(IconCalendar)`
  ${biggerIconsWithMargin}
`

export const BiggerIconUser = styled(IconUser)`
  ${biggerIconsWithMargin}
`

export const BiggerIconGlobe = styled(IconGlobe)`
  ${biggerIconsWithMargin}
`

export const BiggerIconDataSharing = styled(IconSharing)`
  ${biggerIconsWithMargin}
`

export const BiggerIconText = styled(IconText)`
  ${biggerIconsWithMargin}
`

export const BiggerIconQuoteOpen = styled(IconQuoteOpen)`
  ${biggerIconsWithMargin}
`

export const BiggerIconMapOutline = styled(IconMapOutline)`
  ${biggerIcons}
`

export const BiggerIconTable = styled(IconTable)`
  ${biggerIcons}
`

export const BiggerIconClose = styled(IconClose)`
  font-size: ${theme.typography.largeFontSize};
`

export const StyledMapPinContainer = styled.div`
  margin-right: 0.8rem;
`

export const StyledSvgContainer = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 0.2rem;
  margin-right: 0.6rem;
`

export const StyledReefContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StyledReefRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
export const StyledReefItem = styled.p`
  width: 50%;
  text-transform: capitalize;
  margin: 0;
`

export const StyledReefItemBold = styled(StyledReefItem)`
  font-weight: bold;
  width: 50%;
`
export const StyledVisibleBackground = styled.div`
  background-color: ${theme.color.grey1};
`
export const SelectedSiteActionBar = styled(Row)`
  width: 100%;
  gap: ${theme.spacing.small};

  & > button {
    width: 100%;
  }
`

export const TabButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;

  & button {
    width: 100%;
  }
`

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
`
