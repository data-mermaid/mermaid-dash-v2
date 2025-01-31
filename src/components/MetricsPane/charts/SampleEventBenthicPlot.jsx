import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const benthicCategories = Object.keys(chartTheme.sampleEventCharts.benthic)

export const SampleEventBenthicPlot = ({ sampleEventProtocols }) => {
  const sampleUnitCount = Object.values(sampleEventProtocols).reduce((acc, protocol) => {
    const count = protocol?.percent_cover_benthic_category_avg ? protocol.sample_unit_count : 0
    return acc + count
  }, 0)

  const benthicPercentageCover = benthicCategories.map((category) => {
    const categoryValue = Object.values(sampleEventProtocols).reduce((acc, protocol) => {
      const protocolValue = protocol?.percent_cover_benthic_category_avg?.[category] ?? 0
      return acc + protocolValue
    }, 0)

    return {
      name: category,
      value: categoryValue,
    }
  })

  const plotlyDataConfiguration = benthicPercentageCover
    .filter(({ value }) => value > 0)
    .map(({ name, value }) => {
      return {
        x: [1],
        y: [value / 100],
        type: 'bar',
        name: `${name} (${value}%)`,
        marker: {
          color: chartTheme.sampleEventCharts.benthic[name],
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
        <MetricCardH3>Benthic % Cover</MetricCardH3>
        <ChartSubtitle>{sampleUnitCount.toLocaleString()} Surveys</ChartSubtitle>
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
