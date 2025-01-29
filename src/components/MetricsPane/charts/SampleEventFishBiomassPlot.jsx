import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const categories = Object.keys(chartTheme.sampleEventCharts.trophicColorMap)

export const SampleEventFishBiomassPlot = ({ fishbeltData }) => {
  const fishbeltSampleUnitCount = fishbeltData?.sample_unit_count
  const fishBiomassTropicGroupData = fishbeltData?.biomass_kgha_trophic_group_avg

  const trophicValues = categories.map((category) => {
    return fishBiomassTropicGroupData?.[category] ?? 0
  })

  const plotlyDataConfiguration = [
    {
      x: categories,
      y: trophicValues,
      type: 'bar',
      marker: {
        color: categories.map((label) => chartTheme.sampleEventCharts.trophicColorMap[label]),
      },
      xbins: {
        size: 100,
      },
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, b: 100 },
    xaxis: {
      ...chartTheme.layout.xaxis,
      tickangle: -45,
      tickfont: { size: 9 },
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Tropic Group',
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Kg/Ha' },
    },
  }
  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass</MetricCardH3>
        <ChartSubtitle>{fishbeltSampleUnitCount.toLocaleString()} Surveys</ChartSubtitle>
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
