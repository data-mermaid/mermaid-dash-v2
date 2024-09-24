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
  z-index: 5;
  background-color: ${(props) =>
    props.$showMobileExpandedMetricsPane ? theme.color.grey1 : 'transparent'};
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    width: 100%;
    bottom: 0;
    display: grid;
    grid-template-rows: auto 1fr;
    ${(props) =>
      props.$showMobileExpandedMetricsPane &&
      `
     top: 9.8rem;
      width: 100vw;
      bottom: 0;
    `};
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
  gap: 0.5rem;

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
    width: 100%;
    font-size: ${theme.typography.largeIconSize};
    display: block;
    position: absolute;
    top: -5rem;
    justify-self: center;
    background-color: transparent;
    border: none;
    color: ${theme.color.white};
    ${(props) => props.$showMobileExpandedMetricsPane && `background-color: ${theme.color.grey1};`}
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
  `)}
`

export const MultipleMetricCardsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    width: auto;
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
  padding: 1rem;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    margin: 0;
    flex-grow: 1;
    height: 100%;
  `)}
`

export const MetricCardH3 = styled.h3`
  all: unset;
  padding: 0;
  margin: 0;
  font-size: ${theme.typography.defaultFontSize};
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: 13px;
  `)}
`
const pStyles = css`
  padding: 0;
  margin: 0;
`
const pMobileStyles = css`
  font-size: 20px;
  font-weight: 400;
`
export const MetricCardPBig = styled.p`
  ${pStyles}
  font-size: 64px;
  font-weight: 400;
  ${mediaQueryTabletLandscapeOnly(css`
    ${pMobileStyles}
  `)}
`
export const MetricCardPMedium = styled.p`
  ${pStyles}
  font-size: 36px;
  font-weight: 400;
  ${mediaQueryTabletLandscapeOnly(css`
    ${pMobileStyles}
  `)}
`
export const InlineOnDesktopMetricWrapper = styled.div`
  ${mediaQueryTabletLandscapeOnly(css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `)}

  & span {
    ${pStyles}
    font-weight: 700;
    ${mediaQueryTabletLandscapeOnly(css`
      ${pMobileStyles}
    `)}
  }
`
export const MobileExpandedMetricsPane = styled.div`
  background-color: ${theme.color.grey1};
  width: 100%;
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
