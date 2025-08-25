import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { useTranslation } from 'react-i18next'

const chartTheme = plotlyChartTheme
const bleachingBenthicCategories = Object.entries(
  chartTheme.chartCategoryType.bleachingBenthicColorMap,
)

export const SampleEventBleachingPlot = ({ bleachingData }) => {
  const { t } = useTranslation()
  const {
    percent_hard_avg_avg: percentHard,
    percent_soft_avg_avg: percentSoft,
    percent_algae_avg_avg: percentAlgae,
    quadrat_count_avg: quadratCount,
    sample_unit_count: sampleUnitCount,
  } = bleachingData

  const isBleachingDataAvailable = [percentHard, percentSoft, percentAlgae, quadratCount].every(
    (value) => value !== null && value !== undefined,
  )

  const totalSampleUnits = isBleachingDataAvailable ? quadratCount * sampleUnitCount : 0
  const otherBleachingPercentage = isBleachingDataAvailable
    ? parseFloat((100 - percentHard - percentSoft - percentAlgae).toFixed(1))
    : undefined

  const bleachingPercentageValues = [
    percentHard ?? 0,
    percentSoft ?? 0,
    percentAlgae ?? 0,
    otherBleachingPercentage ?? 0,
  ]

  const plotlyDataConfiguration = bleachingBenthicCategories
    .map(([category, color], index) => ({
      x: [1],
      y: [bleachingPercentageValues[index]],
      type: 'bar',
      name: `${category} (${bleachingPercentageValues[index].toFixed(1)}%)`,
      marker: {
        color: color,
      },
      hovertemplate: `${category}<br>%{y:.1f}%<extra></extra>`,
    }))
    .filter((trace) => trace.y.some((value) => value > 0))

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
        <MetricCardH3>{t('benthic_percent_cover_type', { type: 'bleaching' })}</MetricCardH3>
        {isBleachingDataAvailable && (
          <ChartSubtitle>{`${t('sample_unit_other', { count: totalSampleUnits })}`}</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {isBleachingDataAvailable ? (
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

SampleEventBleachingPlot.propTypes = {
  bleachingData: PropTypes.shape({
    percent_hard_avg_avg: PropTypes.number,
    percent_soft_avg_avg: PropTypes.number,
    percent_algae_avg_avg: PropTypes.number,
    quadrat_count_avg: PropTypes.number,
    sample_unit_count: PropTypes.number,
  }).isRequired,
}
