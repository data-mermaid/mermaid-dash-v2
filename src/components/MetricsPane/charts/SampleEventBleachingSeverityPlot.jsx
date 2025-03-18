import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = plotlyChartTheme
const bleachingColor = chartTheme.chartCategoryType.bleachingColorMap
export const SampleEventBleachingSeverityPlot = ({ coloniesBleachedData }) => {
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

  const totalSurveys = isBleachingSeverityDataAvailable ? countTotalAvg * sampleUnitCount : 0

  const plotlyDataConfiguration = [
    {
      x: [1],
      y: [percentNormal ? percentNormal / 100 : 0],
      type: 'bar',
      name: `Normal (${percentNormal}%)`,
      marker: { color: bleachingColor['Normal'] },
    },
    {
      x: [1],
      y: [percentPale ? percentPale / 100 : 0],
      type: 'bar',
      name: `Pale (${percentPale}%)`,
      marker: { color: bleachingColor['Pale'] },
    },
    {
      x: [1],
      y: [percent20 ? percent20 / 100 : 0],
      type: 'bar',
      name: `0-20% bleached (${percent20}%)`,
      marker: { color: bleachingColor['0-20%'] },
    },
    {
      x: [1],
      y: [percent50 ? percent50 / 100 : 0],
      type: 'bar',
      name: `20-50% bleached (${percent50}%)`,
      marker: { color: bleachingColor['20-50%'] },
    },
    {
      x: [1],
      y: [percent80 ? percent80 / 100 : 0],
      type: 'bar',
      name: `50-80% bleached (${percent80}%)`,
      marker: { color: bleachingColor['50-80%'] },
    },
    {
      x: [1],
      y: [percent100 ? percent100 / 100 : 0],
      type: 'bar',
      name: `80-100% bleached (${percent100}%)`,
      marker: { color: bleachingColor['80-100%'] },
    },
    {
      x: [1],
      y: [percentDead ? percentDead / 100 : 0],
      type: 'bar',
      name: `Recently dead (${percentDead}%)`,
      marker: { color: bleachingColor['Dead'] },
    },
  ].filter((trace) => trace.y.some((value) => value > 0))

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 70, b: 20, r: 210 },
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
        <MetricCardH3>Bleaching - Severity</MetricCardH3>
        {isBleachingSeverityDataAvailable && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
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
