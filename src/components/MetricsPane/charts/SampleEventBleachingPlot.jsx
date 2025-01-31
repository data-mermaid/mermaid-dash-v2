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
      ? 100 - percent_hard_avg_avg - percent_soft_avg_avg - percent_algae_avg_avg
      : undefined

  const bleachingPercentageValues = [
    percent_algae_avg_avg ?? 0,
    percent_soft_avg_avg ?? 0,
    otherBleachingPercentage ?? 0,
    percent_hard_avg_avg ?? 0,
  ]

  const plotlyDataConfiguration = Object.keys(bleachingCategory).map((category, index) => ({
    x: [1],
    y: [bleachingPercentageValues[index] / 100],
    type: 'bar',
    name: `${bleachingCategory[category]} (${bleachingPercentageValues[index]}%)`,
    marker: {
      color: chartTheme.sampleEventCharts.bleaching.marker.color[index],
    },
  }))

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { t: 50, r: 0, b: 40, l: 40 },
    barmode: 'stack',
    bargap: 0,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: '',
      showticklabels: false,
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: '',
      range: [0, 1],
      tickvals: Array.from({ length: 11 }, (_, i) => i / 10),
      tickformat: '.0%',
    },
    showlegend: true,
    legend: {
      font: { size: 10 },
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
