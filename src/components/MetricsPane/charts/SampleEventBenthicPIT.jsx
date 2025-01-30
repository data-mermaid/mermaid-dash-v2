import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const SampleEventBenthicPIT = ({ benthicPITData }) => {
  const benthicPercentageCoverData = benthicPITData?.percent_cover_benthic_category_avg || {}
  const benthicSampleUnitCount = benthicPITData?.sample_unit_count ?? 0

  const plotlyDataConfiguration = Object.entries(benthicPercentageCoverData)
    .sort((a, b) => a[1] - b[1])
    .map(([key, value]) => {
      return {
        x: [1],
        y: [value / 100],
        type: 'bar',
        name: `${key} (${value}%)`,
        marker: {
          color: chartTheme.sampleEventCharts.benthic[key],
        },
      }
    })

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
      tickvals: Array.from({ length: 11 }, (_, i) => i / 10), // [0, 10, 20, ..., 100]
      tickformat: '.0%',
    },
    showlegend: true,
    legend: {
      orientation: 'v',
      y: 0.5,
      font: { size: 10 },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Benthic % Cover</MetricCardH3>
        <ChartSubtitle>{benthicSampleUnitCount.toLocaleString()} Surveys</ChartSubtitle>
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
