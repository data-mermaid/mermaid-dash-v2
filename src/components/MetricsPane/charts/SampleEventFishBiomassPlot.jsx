import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const fishTropicGroupCategory = {
  omnivore: 'Omnivore',
  piscivore: 'Piscivore',
  planktivore: 'Planktivore',
  'invertivore-mobile': 'Invertivore mobile',
  'invertivore-sessible': 'Invertivore sessible',
  'herbivore-macroalgae': 'Herbivore macroalgae',
  'herbivore-detritivore': 'Herbivore detritivore',
}

export const SampleEventFishBiomassPlot = ({ fishbeltData }) => {
  const fishbeltSampleUnitCount = fishbeltData?.sample_unit_count ?? 0
  const fishBiomassTropicGroupData = fishbeltData?.biomass_kgha_trophic_group_avg

  const fishTropicGroupValues = Object.keys(fishTropicGroupCategory).map((category) => {
    return fishBiomassTropicGroupData?.[category] ?? 0
  })
  const fishTropicGroupLabels = Object.values(fishTropicGroupCategory).map(
    (category) => `${category}`,
  )
  const formattedFishTropicGroupLabels = fishTropicGroupLabels.map((label) =>
    label.replace(' ', '<br>'),
  )

  const plotlyDataConfiguration = [
    {
      x: fishTropicGroupLabels,
      y: fishTropicGroupValues,
      type: 'bar',
      marker: chartTheme.sampleEventCharts.fishTropicGroupCover.marker,
      xbins: {
        size: 100,
      },
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, b: 80 },
    xaxis: {
      ...chartTheme.layout.xaxis,
      tickangle: -45,
      tickfont: { size: 9 },
      tickmode: 'array',
      tickvals: fishTropicGroupLabels,
      ticktext: formattedFishTropicGroupLabels,
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
