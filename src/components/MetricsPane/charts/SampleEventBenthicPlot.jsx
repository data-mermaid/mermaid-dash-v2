import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { useTranslation } from 'react-i18next'

const chartTheme = plotlyChartTheme
const benthicCoverCategories = Object.entries(chartTheme.chartCategoryType.benthicCoverColorMap)
const benthicCoverApiKey = {
  hard_coral: 'Hard coral',
  bare_substrate: 'Bare substrate',
  crustose_coralline_algae: 'Crustose coralline algae',
  rubble: 'Rubble',
  cyanobacteria: 'Cyanobacteria',
  seagrass: 'Seagrass',
  sand: 'Sand',
  macroalgae: 'Macroalgae',
  turf_algae: 'Turf algae',
  soft_coral: 'Soft coral',
  other_invertebrates: 'Other invertebrates',
}

export const SampleEventBenthicPlot = ({ benthicType, benthicData }) => {
  const { t } = useTranslation()
  const totalSampleUnits = benthicData?.sample_unit_count ?? 0
  const benthicPercentageData = benthicData?.percent_cover_benthic_category_avg

  const benthicPercentageCover = benthicCoverCategories.map(([category, color]) => ({
    label: t(`chart_category.${category}`),
    value: benthicPercentageData?.[benthicCoverApiKey[category]] ?? 0,
    color,
  }))

  const plotlyDataConfiguration = benthicPercentageCover
    .filter(({ value }) => value > 0)
    .map(({ label, value, color }) => {
      return {
        x: [1],
        y: [value],
        type: 'bar',
        name: `${label} (${value.toFixed(1)}%)`,
        marker: { color },
        hovertemplate: `${label}<br>%{y:.1f}%<extra></extra>`,
      }
    })

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 70, b: 20, r: 200 },
    barmode: 'stack',
    bargap: 0,
    xaxis: {
      ...chartTheme.layout.xaxis,
      showticklabels: false,
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: {
        text: t('benthic_cover_percentage'),
      },
      range: [0, 100],
      tickvals: Array.from({ length: 11 }, (_, i) => i * 10),
    },
    showlegend: true,
    legend: {
      font: { size: 9 },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>{t('benthic_percent_cover_type', { type: benthicType })}</MetricCardH3>
        {benthicPercentageData && (
          <ChartSubtitle>{`${t('sample_unit_other', { count: totalSampleUnits })}`}</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {benthicPercentageData ? (
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

SampleEventBenthicPlot.propTypes = {
  benthicType: PropTypes.string.isRequired,
  benthicData: PropTypes.shape({
    sample_unit_count: PropTypes.number,
    percent_cover_benthic_category_avg: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
}
