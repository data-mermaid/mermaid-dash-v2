import styled from 'styled-components'
import theme from '../../styles/theme'

export const ChartTabsWrapper = styled.div`
  width: 100%;
`
export const TabList = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0;
`
export const Tab = styled.button`
  all: unset;
  padding: ${theme.spacing.xsmall};
  width: 100%;
  text-align: center;
  background-color: ${(props) =>
    props['aria-selected'] ? theme.color.white : theme.color.background};

  border: ${(props) =>
    props['aria-selected'] ? `${theme.spacing.borderSmall} solid ${theme.color.border}` : 'none'};

  border-bottom: none;

  &:hover {
    cursor: pointer;
  }
`

export const TabPanel = styled.div`
  width: 100%;
  background-color: ${theme.color.white};
  padding: ${theme.spacing.small};
  border: ${theme.spacing.borderSmall} solid ${theme.color.border};
  box-sizing: border-box;
`
