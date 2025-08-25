import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { useTranslation } from 'react-i18next'

const chartTheme = plotlyChartTheme
const bleachingColor = chartTheme.chartCategoryType.bleachingColorMap
export const SampleEventBleachingSeverityPlot = ({ coloniesBleachedData }) => {
  const { t } = useTranslation()
  const {
    count_total_avg: countTotalAvg,
    percent_100_avg: percent100,
    percent_20_avg: percent20,
    percent_50_avg: percent50,
    percent_80_avg: percent80,
    percent_dead_avg: percentDead,
    percent_normal_avg: percentNormal,
    percent_pale_avg: percentPale,
    sample_unit_count: sampleUnitCount,
  } = coloniesBleachedData

  const isBleachingSeverityDataAvailable = [
    percent100,
    percent20,
    percent50,
    percent80,
    percentDead,
    percentNormal,
    percentPale,
    countTotalAvg,
  ].every((value) => value !== null && value !== undefined)

  const totalSampleUnits = isBleachingSeverityDataAvailable ? countTotalAvg * sampleUnitCount : 0

  const plotlyDataConfiguration = [
    {
      x: [1],
      y: [percentNormal ?? 0],
      type: 'bar',
      name: `${t('chart_category.normal')} (${(percentNormal ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Normal'] },
      hovertemplate: `${t('chart_category.normal')}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percentPale ?? 0],
      type: 'bar',
      name: `${t('chart_category.pale')} (${(percentPale ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Pale'] },
      hovertemplate: `${t('chart_category.pale')}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percent20 ?? 0],
      type: 'bar',
      name: `${t('chart_category.percent_bleached', { percent: '0-20%' })} (${(percent20 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['0-20%'] },
      hovertemplate: `${t('chart_category.percent_bleached', { percent: '0-20%' })}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percent50 ?? 0],
      type: 'bar',
      name: `${t('chart_category.percent_bleached', { percent: '20-50%' })} (${(percent50 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['20-50%'] },
      hovertemplate: `${t('chart_category.percent_bleached', { percent: '20-50%' })}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percent80 ?? 0],
      type: 'bar',
      name: `${t('chart_category.percent_bleached', { percent: '50-80%' })} (${(percent80 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['50-80%'] },
      hovertemplate: `${t('chart_category.percent_bleached', { percent: '50-80%' })}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percent100 ?? 0],
      type: 'bar',
      name: `${t('chart_category.percent_bleached', { percent: '80-100%' })} (${(percent100 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['80-100%'] },
      hovertemplate: `${t('chart_category.percent_bleached', { percent: '80-100%' })}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
    {
      x: [1],
      y: [percentDead ?? 0],
      type: 'bar',
      name: `${t('chart_category.recently_dead')} (${(percentDead ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Dead'] },
      hovertemplate: `${t('chart_category.recently_dead')}<br>%{y:.1f}${t('percent_of_colonies')}<extra></extra>`,
    },
  ].filter((trace) => trace.y.some((value) => value > 0))

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
        text: t('percent_of_colonies'),
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
        <MetricCardH3>{t('bleaching_severity')}</MetricCardH3>
        {isBleachingSeverityDataAvailable && (
          <ChartSubtitle>{`${t('sample_unit_other', { count: totalSampleUnits })}`}</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {isBleachingSeverityDataAvailable ? (
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

SampleEventBleachingSeverityPlot.propTypes = {
  coloniesBleachedData: PropTypes.shape({
    count_total_avg: PropTypes.number,
    percent_100_avg: PropTypes.number,
    percent_20_avg: PropTypes.number,
    percent_50_avg: PropTypes.number,
    percent_80_avg: PropTypes.number,
    percent_dead_avg: PropTypes.number,
    percent_normal_avg: PropTypes.number,
    percent_pale_avg: PropTypes.number,
    sample_unit_count: PropTypes.number,
  }).isRequired,
}
