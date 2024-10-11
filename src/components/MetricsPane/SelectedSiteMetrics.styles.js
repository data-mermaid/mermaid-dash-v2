import styled, { css } from 'styled-components'

import {
  IconPersonCircle,
  IconTextBoxMultiple,
  IconCalendar,
  IconText,
} from '../../assets/dashboardOnlyIcons'
import { IconGlobe, IconUser } from '../../assets/icons'
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
  width: 27.5rem;

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
  margin-right: 0.8rem;
`

export const BiggerIconPersonCircle = styled(IconPersonCircle)`
  ${biggerIcons}
`
export const BiggerIconTextBoxMultiple = styled(IconTextBoxMultiple)`
  ${biggerIcons}
`

export const BiggerIconCalendar = styled(IconCalendar)`
  ${biggerIcons}
`

export const BiggerIconUser = styled(IconUser)`
  ${biggerIcons}
`

export const BiggerIconGlobe = styled(IconGlobe)`
  ${biggerIcons}
`

export const BiggerIconText = styled(IconText)`
  ${biggerIcons}
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
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${theme.color.grey0} ${theme.color.grey1};
  scrollbar-gutter: stable; // if no scrollbar, make sure the 'padded look from the parent is preserved
  // Commented-out as it was causing unalignment in the pane. Not deleting if I learn it is needed in future.
  /* margin-right: -1rem; // make scrollbar not take up too much space */
`
