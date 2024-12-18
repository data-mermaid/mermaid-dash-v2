import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const AggregateHardCoralCover = () => {
  const { displayedSurveys } = useContext(FilterProjectsContext)

  const hardCoralAveragesPerSurvey = displayedSurveys
    .map((record) => {
      const { protocols } = record

      const benthicPitAverage =
        protocols.benthicpit?.percent_cover_benthic_category_avg?.['Hard coral'] ?? 0
      const benthicLitAverage =
        protocols.benthiclit?.percent_cover_benthic_category_avg?.['Hard coral'] ?? 0
      const benthicPqtAverage =
        protocols.benthicpqt?.percent_cover_benthic_category_avg?.['Hard coral'] ?? 0
      const quadratBenthicAverage = protocols.quadrat_benthic_percent?.percent_hard_avg_avg ?? 0

      const numerator =
        benthicLitAverage + benthicPitAverage + benthicPqtAverage + quadratBenthicAverage
      const denominator =
        (benthicPitAverage ? 1 : 0) +
        (benthicLitAverage ? 1 : 0) +
        (benthicPqtAverage ? 1 : 0) +
        (quadratBenthicAverage ? 1 : 0)

      return !denominator ? undefined : numerator / denominator
    })
    .filter(Boolean)

  const markerColors = hardCoralAveragesPerSurvey.map((_, index) => {
    const colors = chartTheme.aggregateCharts.hardCoralCover.marker

    if (index <= 5) {
      return colors.low
    }
    if (index > 5 && index <= 15) {
      return colors.medium
    }

    return colors.high
  })

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Hard Coral Cover </MetricCardH3>
        <ChartSubtitle>{hardCoralAveragesPerSurvey.length} Surveys</ChartSubtitle>
      </TitlesWrapper>

      <Plot
        data={[
          {
            x: hardCoralAveragesPerSurvey,
            xbins: { start: 0, end: 100, size: 2 },
            type: 'histogram',
            marker: {
              color: markerColors,
            },
          },
        ]}
        layout={{
          ...chartTheme.layout,
          xaxis: {
            ...chartTheme.layout.xaxis,
            title: {
              ...chartTheme.layout.xaxis.title,
              text: '% Hard Coral Cover',
            },
            tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          },
          yaxis: {
            ...chartTheme.layout.yaxis,
            title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
          },
        }}
        config={chartTheme.config}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartWrapper>
  )
}
