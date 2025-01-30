import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const bleachingCategory = {
  percent_hard_avg_avg: 'Avg Hard Coral Cover',
  other: 'Other Cover',
  percent_soft_avg_avg: 'Avg Soft Coral Cover',
  percent_algae_avg_avg: 'Avg Macroalgae Cover',
}

export const SampleEventBleachingPlot = ({ bleachingData }) => {
  const {
    percent_hard_avg_avg,
    percent_soft_avg_avg,
    percent_algae_avg_avg,
    quadrat_count_avg,
    sample_unit_count,
  } = bleachingData
  const bleachingSampleUnitCount = quadrat_count_avg > 0 ? quadrat_count_avg * sample_unit_count : 0
  const otherBleachingPercentage =
    quadrat_count_avg > 0
      ? 100 - percent_hard_avg_avg + percent_soft_avg_avg + percent_algae_avg_avg
      : undefined

  const bleachingPercentageValues = [
    percent_hard_avg_avg ?? 0,
    otherBleachingPercentage ?? 0,
    percent_soft_avg_avg ?? 0,
    percent_algae_avg_avg ?? 0,
  ]

  const bleachingPercentageLabels = Object.keys(bleachingCategory).map(
    (category, index) => `${bleachingCategory[category]} (${bleachingPercentageValues[index]}%)`,
  )

  const plotlyDataConfiguration = [
    {
      labels: bleachingPercentageLabels,
      values: bleachingPercentageValues,
      type: 'pie',
      textinfo: 'none',
      hoverinfo: 'label+percent',
      marker: chartTheme.sampleEventCharts.bleaching.marker,
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { t: 20, r: 0, b: 0, l: 20 },
    showlegend: true,
    legend: {
      orientation: 'v',
      y: 0.5,
      font: { size: 9 },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Bleaching - % Benthic Cover</MetricCardH3>
        <ChartSubtitle>{bleachingSampleUnitCount.toLocaleString()} Surveys</ChartSubtitle>
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
