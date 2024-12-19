import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const AggregateHabitatComplexity = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const habitatComplexityValues = filteredSurveys
    .map((record) => record.protocols.habitatcomplexity?.score_avg_avg)
    .filter(Boolean)

  const plotlyDataConfiguration = [
    {
      x: habitatComplexityValues,
      type: 'histogram',
      marker: {
        color: chartTheme.aggregateCharts.default.marker.color,
      },
      xbins: {
        size: 1,
      },
    },
  ]
  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Score',
      },
      tickvals: [0, 1, 2, 3, 4, 5],
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Habitat Complexity </MetricCardH3>
        <ChartSubtitle>{habitatComplexityValues.length} Surveys</ChartSubtitle>
      </TitlesWrapper>

      <Plot
        data={plotlyDataConfiguration}
        layout={plotlyLayoutConfiguration}
        config={chartTheme.config}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartWrapper>
  )
}
