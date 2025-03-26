import styled from 'styled-components'
import theme from '../../../styles/theme'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'

export const ChartSubtitle = styled.p`
  font-size: ${theme.typography.smallFontSize};
  margin-top: ${theme.spacing.xxsmall};
  margin-bottom: 0;
`
export const TitlesWrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 80%;
`
export const ChartWrapper = styled.div`
  position: relative;
  height: ${plotlyChartTheme.layout.height}px;
`

export const NoChartWrapper = styled.div`
  position: relative;
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const HorizontalLine = styled.div`
  position: absolute;
  top: 45px;
  border-top: 1px solid ${theme.color.border};
  width: 100%;
  z-index: 1;
`
