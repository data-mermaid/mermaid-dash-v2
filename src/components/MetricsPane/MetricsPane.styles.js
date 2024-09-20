import styled, { css } from 'styled-components'
import { mediaQueryTabletLandscapeOnly, hoverState } from '../../styles/mediaQueries'
import theme from '../../styles/theme'
import { ButtonSecondary } from '../generic'
import {
  IconCaretUp,
  IconCaretDown,
  IconPersonCircle,
  IconTextBoxMultiple,
  IconCalendar,
  IconText,
} from '../../assets/dashboardOnlyIcons'
import { IconGlobe, IconUser } from '../../assets/icons'
import { Row } from '../generic/positioning'

export const StyledMetricsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  ${(props) => props.$showMetricsPane && 'min-width: 35rem;'}
  ${(props) => !props.$showMetricsPane && 'max-width: 40rem;'}
  position: relative;
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    z-index: 5;
    background-color: transparent;
    width: 90%;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    ${(props) =>
      props.$showMobileExpandedMetricsPane &&
      `
      top: 7.9rem;
      width: 100vw;
      bottom: 0;
    `}
  `)}
`

export const SummarizedMetrics = styled.div`
  width: 100%;
  overflow-y: scroll;
  ${(props) => props.$isDesktopWidth && 'height: calc(100vh - 10rem);'}
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
    overflow-y: hidden;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 0;
    ${(props) =>
      props.$showMobileExpandedMetricsPane ? 'align-items: flex-start;' : 'align-items: flex-end;'}
    ${(props) => props.$showMobileExpandedMetricsPane && `background-color: ${theme.color.grey1};`}
    height: 11.2rem;
  `)}
`

export const BiggerIconCaretUp = styled(IconCaretUp)`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.7rem;
  position: relative;
`

export const BiggerIconCaretDown = styled(IconCaretDown)`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.7rem;
  position: relative;
`

export const DesktopToggleMetricsPaneButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  left: -10rem;
  height: 6rem;
  z-index: 5;
  width: 10rem;
  border: none;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

export const MobileExpandMetricsPaneButton = styled(ButtonSecondary)`
  display: none;
  ${hoverState(css`
    ${(props) =>
      props.$showMobileExpandedMetricsPane
        ? `background-color: ${theme.color.grey1};`
        : 'background-color: transparent'}
  `)}

  ${mediaQueryTabletLandscapeOnly(css`
    font-size: ${theme.typography.largeIconSize};
    display: block;
    position: absolute;
    top: -5rem;
    justify-self: center;
    background-color: transparent;
    border: none;
    color: ${theme.color.white};
    ${(props) => props.$showMobileExpandedMetricsPane && `background-color: ${theme.color.grey1};`}
    ${(props) => props.$showMobileExpandedMetricsPane && 'width: 100vw;'}
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
  `)}
`

export const SurveysAndTransectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
    order: -1;
    flex-grow: 2;
    height: 100%;
  `)}
`

export const MetricsCard = styled.div`
  background-color: ${theme.color.white};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    margin: 0;
    width: auto;
    flex-grow: 1;
    height: 100%;
  `)}
`

export const H3 = styled.h3`
  padding: 0;
  margin: 0.5rem;
`

export const P = styled.p`
  padding: 0;
  margin: 0.5rem;
  font-size: ${theme.typography.defaultFontSize};
`

export const MobileExpandedMetricsPane = styled.div`
  background-color: ${theme.color.grey1};
  height: calc(100vh - 14rem);
  width: 100vw;
`

export const SelectedSiteMetricsCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  border: 1px solid ${theme.color.grey0};
  background-color: ${theme.color.white};
`

export const SelectedSiteSiteCardContainer = styled(SelectedSiteMetricsCardContainer)`
  text-transform: uppercase;
  align-items: center;
`

export const SelectedSiteContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 27.5rem;
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

export const StyledHeader = styled.h2`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  flex-grow: 1;
`

export const StyledSummaryMetadataContainer = styled.fieldset`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 1rem 0 1rem;
  border: 0;
  padding: 0;
`
export const StyledMetricsSelector = styled.div`
  display: flex;
  width: calc(50% - 0.5rem);
  border: 1px solid ${theme.color.grey0};
  background-color: ${theme.color.white};
  justify-content: center;
  padding: 0.5rem;
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

export const StyledChevronSpan = styled.span`
  padding-left: 0.8rem;
`

export const DesktopFollowScreenButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  left: -42rem;
  height: 6rem;
  z-index: 5;
  width: 31rem;
  border: solid 1px ${theme.color.secondaryBorder}
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

export const StyledLabel = styled.label`
  cursor: pointer;
`
export const SelectedSiteActionBar = styled(Row)`
  width: 100%;
  gap: ${theme.spacing.small};

  & > button {
    width: 100%;
  }
`
