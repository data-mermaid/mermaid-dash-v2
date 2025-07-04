import styled, { css } from 'styled-components'
import {
  mediaQueryTabletLandscapeOnly,
  hoverState,
  mediaQueryTabletLandscapeUp,
} from '../../styles/mediaQueries'
import theme from '../../styles/theme'
import { ButtonSecondary } from '../generic'
import { IconCaretUp, IconCaretDown } from '../../assets/dashboardOnlyIcons'

export const StyledMetricsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 0.5rem;
  padding: 0.5rem;
  z-index: 5;
  background-color: transparent;
  height: 100%;
  ${({ $isMetricsPaneShowing }) =>
    $isMetricsPaneShowing
      ? css`
          min-width: 41rem;
          width: 50%;
          max-width: 54rem;
        `
      : css`
          max-width: 40rem;
        `}
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    width: 100%;
    max-width: unset;
    min-width: unset;
    bottom: 0;
    height: auto;
    ${({ $showMobileExpandedMetricsPane }) =>
      $showMobileExpandedMetricsPane &&
      css`
        top: ${theme.spacing.headerHeight};
        background-color: ${theme.color.grey1};
        min-height: 100%; // this ensures if not charts are loaded, that we have a grey background covering the map
        height: fit-content; // this fixes a Samsung S10e bug where children (DisplayedProjectsMetricsWrapper) of an absolutely positioned element cant scroll, or at least plotly charts cant scroll. See https://trello.com/c/JGgOZlDN/1210-mobile-scrolling-on-chrome-on-android
      `};
  `)}
`
export const DisplayedProjectsMetricsWrapper = styled.div`
  height: 100%;
  overflow-y: visible;
  ${mediaQueryTabletLandscapeUp(css`
    overflow-y: scroll;
  `)}
`
export const ChartsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  ${mediaQueryTabletLandscapeOnly(css`
    display: ${(props) => (props.$showMobileExpandedMetricsPane ? 'flex' : 'none')};
  `)}
`
export const SummarizedMetrics = styled.div`
  width: 100%;
  overflow-y: scroll;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

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
    margin-bottom: 0.5rem;
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
`

export const DesktopToggleMetricsPaneButton = styled(ButtonSecondary)`
  position: absolute;
  top: 1.3rem;
  left: -4rem;
  height: 4rem;
  z-index: 10;
  width: 4rem;
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
    display: flex;
    border: none;
    color: ${theme.color.white};
    position: sticky;
    top: -0.5rem;
    margin: -0.5rem 0;
    z-index: 1;
    background-color: ${(props) =>
      props.$showMobileExpandedMetricsPane ? theme.color.grey1 : 'transparent'};
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
  position: relative;
  ${mediaQueryTabletLandscapeOnly(css`
    margin: 0;
    flex-grow: 1;
    padding: 1rem ${theme.spacing.small};
    height: 100%;
  `)}
`

export const MetricCardInlineText = styled.div`
  display: flex;
  align-items: center;
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
    letter-spacing: 0rem;
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

export const StyledHeader = styled.h2`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`

export const StyledChevronSpan = styled.span`
  padding-left: 0.8rem;
`

export const FollowToggleContainer = styled.div`
  position: absolute;
  top: 1.3rem;
  left: ${({ $mapWidth, $enableFollowScreen }) => {
    if ($mapWidth < 830) {
      return '-9rem'
    }

    // follow button sizes are different between enabled and disabled
    // -25.3rem is the left position of the follow button when it's disabled
    // -19.7rem is the left position of the follow button when it's enabled
    return $enableFollowScreen ? '-25.3rem' : '-19.7rem'
  }};
  height: 4rem;
  z-index: 100;
  display: flex;
  flex-direction: row;
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

export const StyledFollowIconButton = styled(ButtonSecondary)`
  height: 100%;
  background-color: ${({ $enableFollowScreen }) =>
    $enableFollowScreen ? theme.color.secondaryColor : theme.color.white};
`

export const StyledFollowButton = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  background-color: ${({ $enableFollowScreen }) =>
    $enableFollowScreen ? theme.color.secondaryColor : theme.color.white};
`

export const StyledLabel = styled.label`
  cursor: pointer;
`

export const MapAttributeRow = styled.div`
  text-align: center;
  font-size: 1rem;
  color: ${theme.color.secondaryDisabledText};
  margin-top: 2rem;
  padding: 1rem;

  ${mediaQueryTabletLandscapeOnly(css`
    display: ${(props) => (props.$showMobileExpandedMetricsPane ? 'flex' : 'none')};
  `)}
`

export const CircleLoader = styled.div`
  height: 1.6rem;
  display: ${({ showLoadingCircle }) => (showLoadingCircle ? 'inline-block' : 'none')};
  aspect-ratio: 1 / 1;
  border: 2px dashed;
  border-radius: 50%;
  animation: rotation 2s linear infinite;
  margin-right: 0.5rem;
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
