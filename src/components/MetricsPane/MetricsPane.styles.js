import styled, { css } from 'styled-components'
import { mediaQueryTabletLandscapeOnly, hoverState } from '../../styles/mediaQueries'
import theme from '../../styles/theme'
import { ButtonSecondary } from '../generic'
import { IconCaretUp, IconCaretDown } from '../../assets/dashboardOnlyIcons'

export const StyledMetricsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  ${({ $showMetricsPane }) =>
    $showMetricsPane
      ? css`
          min-width: 40rem;
          max-width: 40rem;
        `
      : css`
          max-width: 40rem;
        `}
  position: relative;
  z-index: 5;
  background-color: ${(props) =>
    props.$showMobileExpandedMetricsPane ? theme.color.grey1 : 'transparent'};
  height: 100%;
  overflow-y: scroll;
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    width: 100%;
    max-width: unset;
    bottom: 0;
    height: auto;
    ${({ $showMobileExpandedMetricsPane }) =>
      $showMobileExpandedMetricsPane &&
      css`
        top: ${theme.spacing.headerHeight};
        margin: 0.5rem;
        margin-bottom: 0;
        width: calc(100vw - 1rem);
      `};
  `)}
`
export const DisplayedProjectsMetricsWrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
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
  top: 6.2rem; // 1.3rem + header height (theme.spacing.headerHeight)
  right: ${({ $showMetricsPane }) => ($showMetricsPane ? '40rem' : 0)};
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

export const StyledHeader = styled.h2`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  flex-grow: 1;
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

export const FollowToggleContainer = styled.div`
  position: absolute;
  top: 6.2rem;
  right: 45rem;
  height: 4rem;
  z-index: 400;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
`

export const StyledLabel = styled.label`
  cursor: pointer;
`
