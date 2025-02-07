import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart
const fishTropicGroupKey = {
  Omnivore: 'omnivore',
  Piscivore: 'piscivore',
  Planktivore: 'planktivore',
  'Invertivore mobile': 'invertivore-mobile',
  'Invertivore sessile': 'invertivore-sessile',
  'Herbivore macroalgae': 'herbivore-macroalgae',
  'Herbivore detritivore': 'herbivore-detritivore',
}
const fishTropicGroupCategories = Object.keys(chartTheme.chartCategoryType.fishTropicGroupColorMap)
const fishTropicGroupColors = Object.values(chartTheme.chartCategoryType.fishTropicGroupColorMap)

export const SampleEventFishBiomassPlot = ({ fishbeltData }) => {
  const totalSurveys = fishbeltData?.sample_unit_count ?? 0
  const fishBiomassTropicGroupData = fishbeltData?.biomass_kgha_trophic_group_avg

  const fishTropicGroupValues = fishTropicGroupCategories.map((category) => {
    const categoryKey = fishTropicGroupKey[category]
    return fishBiomassTropicGroupData?.[categoryKey] ?? 0
  })

  const fishTropicGroupLabels = fishTropicGroupCategories.map((category) => category)
  const formattedFishTropicGroupLabels = fishTropicGroupLabels.map((label) =>
    label.replace(' ', '<br>'),
  )

  const plotlyDataConfiguration = [
    {
      x: fishTropicGroupLabels,
      y: fishTropicGroupValues,
      type: 'bar',
      marker: {
        color: fishTropicGroupColors,
        line: { color: 'black', width: 1 },
      },
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
        {fishBiomassTropicGroupData && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
      {fishBiomassTropicGroupData ? (
        <Plot
          data={plotlyDataConfiguration}
          layout={plotlyLayoutConfiguration}
          config={chartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <PrivateChartView />
      )}
    </ChartWrapper>
  )
}
