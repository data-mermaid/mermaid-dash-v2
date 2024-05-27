import styled, { css } from 'styled-components'
import { hoverState } from '../../styles/mediaQueries'
import theme from '../../theme'

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
`

export const Th = styled.th(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    background: ${theme.color.white};
    vertical-align: top;
    font-weight: 500;
    border: 1px solid black;
    &::after {
      content: ${props.isSortingEnabled ? ' \u25b2' : ''};
      font-size: small;
      white-space: nowrap;
    }
  `,
)

export const Tr = styled.tr`
  border: 1px solid black;
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
