import styled, { css } from 'styled-components'
import {
  hoverState,
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../styles/mediaQueries'
import theme from '../../theme'

export const TableNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 3rem 0 ${theme.spacing.xsmall} 0;
  > * {
    padding: ${theme.spacing.small} ${theme.spacing.medium};
  }
  *:nth-child(2) {
    justify-self: end;
  }
`

export const Table = styled('table')`
  border: solid 1px ${theme.color.tableBorderColor};
  table-layout: auto;
  background: ${theme.color.secondaryColor};
  // min-width: 100%;
  border-collapse: collapse;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum';
  /*
  this is to set the height
  of the spans in the Td
  */
  height: 1px;
  width: 100%;
`

export const Th = styled.th(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    background: ${theme.color.white};
    vertical-align: top;
    font-weight: bold;
    border: 1px solid ${theme.color.tableBorderColor};
    &::after {
      content: ${props.isSortingEnabled ? ' \u25b2' : ''};
      font-size: small;
      white-space: nowrap;
    }
  `,
)

export const Tr = styled.tr`
  cursor: pointer;
  border: 1px solid ${theme.color.tableBorderColor};
  &:nth-child(odd) {
    background-color: ${theme.color.tableRowOdd};
  }
  &:nth-child(even) {
    background-color: ${theme.color.tableRowEven};
  }
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
`

export const Td = styled.td(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    border-width: ${theme.spacing.borderSmall};
    border-color: ${theme.color.tableBorderColor};
    border-style: solid;
    position: relative;
    &:first-child {
      border-left: none;
    }
    &:last-child {
      border-right: none;
    }
    ${mediaQueryTabletLandscapeOnly(css`
      &,
      a {
        font-size: smaller;
      }
    `)}
  `,
)

export const TableOverflowWrapper = styled.div`
  max-width: calc(100vw - ${theme.spacing.sideNavWidth} - 20px);
  ${mediaQueryPhoneOnly(css`
    max-width: calc(100vw - ${theme.spacing.mobileSideNavWidth} - 20px);
  `)}
  /*
  20px is the approx scrollbar width this is to prevent
  a horziontal scrollbar at the bottom of the page
  and to keep the toolbar sticky when needed.
  */
  overflow-y: auto;
  & + button,
  button + & {
    margin: ${theme.spacing.medium} 0;
  }
`

export const StickyTableOverflowWrapper = styled(TableOverflowWrapper)`
  overflow: visible;
`

const stickyStyles = css`
  position: sticky;
  white-space: nowrap;
  z-index: 3;
  top: calc(${theme.spacing.headerHeight} - 1px);
  &::before {
    /* 
    this is to account for the border-bottom
    dissapearing when scrolled.
    */
    content: '';
    position: absolute;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.color.tableBorderColor};
  }
`

export const GenericStickyTable = styled(Table)`
  tr th {
    ${stickyStyles}
  }
`
