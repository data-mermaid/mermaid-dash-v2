import styled, { css } from 'styled-components'
import { mediaQueryTabletLandscapeOnly, hoverState } from '../../styles/mediaQueries'
import theme from '../../styles/theme'
import { ButtonSecondary } from '../generic/buttons'
import { IconCaretUp, IconCaretDown } from '../../styles/Icons/dashboardOnlyIcons'

export const StyledMetricsWrapper = styled('div')`
  ${(props) => props.$showMetricsPane && 'min-width: 35rem;'}
  position: relative;
  ${mediaQueryTabletLandscapeOnly(css`
    position: absolute;
    z-index: 5;
    background-color: transparent;
    width: 90%;
    bottom: ${(props) => (props.$showLoadingIndicator ? '5rem;' : '0.5rem;')}
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

export const SummarizedMetrics = styled('div')`
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
    height: ${(props) => (props.$showLoadingIndicator ? '6.7rem;' : '11.2rem;')}
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
  left: -4rem;
  height: 6rem;
  z-index: 5;
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

export const SitesAndTransectsContainer = styled('div')`
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

export const MetricsCard = styled('div')`
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

export const H3 = styled('h3')`
  padding: 0;
  margin: 0.5rem;
`

export const P = styled('p')`
  padding: 0;
  margin: 0.5rem;
  font-size: ${theme.typography.defaultFontSize};
`

export const MobileExpandedMetricsPane = styled('div')`
  background-color: ${theme.color.grey1};
  height: calc(100vh - 14rem);
  width: 100vw;
`
