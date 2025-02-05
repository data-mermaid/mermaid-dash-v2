import styled from 'styled-components'
import theme from '../../../styles/theme'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

export const ChartSubtitle = styled.p`
  font-size: ${theme.typography.smallFontSize};
  margin-top: ${theme.spacing.xxsmall};
  margin-bottom: 0;
`
export const TitlesWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  padding-bottom: 2px;
  border-bottom: 1px solid ${theme.color.border};
`
export const ChartWrapper = styled.div`
  position: relative;
  height: ${dashboardOnlyTheme.plotlyChart.layout.height}px;
`

export const PrivateChartWrapper = styled.div`
  position: relative;
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
