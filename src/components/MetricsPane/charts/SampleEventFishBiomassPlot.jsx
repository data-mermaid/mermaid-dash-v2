import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = plotlyChartTheme
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
      hovertemplate: '<b>%{x}</b><br>%{y}kg/ha<extra></extra>',
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 70, b: 80 },
    xaxis: {
      ...chartTheme.layout.xaxis,
      tickangle: -45,
      tickfont: { size: 9 },
      tickmode: 'array',
      tickvals: fishTropicGroupLabels,
      ticktext: formattedFishTropicGroupLabels,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Tropic group',
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Fish biomass (kg/ha)' },
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
      <HorizontalLine />
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

SampleEventFishBiomassPlot.propTypes = {
  fishbeltData: PropTypes.shape({
    sample_unit_count: PropTypes.number,
    biomass_kgha_trophic_group_avg: PropTypes.shape({
      omnivore: PropTypes.number,
      piscivore: PropTypes.number,
      planktivore: PropTypes.number,
      'invertivore-mobile': PropTypes.number,
      'invertivore-sessile': PropTypes.number,
      'herbivore-macroalgae': PropTypes.number,
      'herbivore-detritivore': PropTypes.number,
    }),
  }).isRequired,
}
