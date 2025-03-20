import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

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

  const totalSampleUnits = isBleachingSeverityDataAvailable ? countTotalAvg * sampleUnitCount : 0

  const plotlyDataConfiguration = [
    {
      x: [1],
      y: [percentNormal ?? 0],
      type: 'bar',
      name: `Normal (${(percentNormal ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Normal'] },
      hovertemplate: 'Normal<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percentPale ?? 0],
      type: 'bar',
      name: `Pale (${(percentPale ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Pale'] },
      hovertemplate: 'Pale<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percent20 ?? 0],
      type: 'bar',
      name: `0-20% bleached (${(percent20 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['0-20%'] },
      hovertemplate: '0-20% bleached<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percent50 ?? 0],
      type: 'bar',
      name: `20-50% bleached (${(percent50 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['20-50%'] },
      hovertemplate: '20-50% bleached<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percent80 ?? 0],
      type: 'bar',
      name: `50-80% bleached (${(percent80 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['50-80%'] },
      hovertemplate: '50-80% bleached<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percent100 ?? 0],
      type: 'bar',
      name: `80-100% bleached (${(percent100 ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['80-100%'] },
      hovertemplate: '80-100% bleached<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: [1],
      y: [percentDead ?? 0],
      type: 'bar',
      name: `Recently dead (${(percentDead ?? 0).toFixed(1)}%)`,
      marker: { color: bleachingColor['Dead'] },
      hovertemplate: 'Recently dead<br>%{y:.1f}% of colonies<extra></extra>',
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
        text: '% of colonies',
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
        <MetricCardH3>Bleaching Severity</MetricCardH3>
        {isBleachingSeverityDataAvailable && (
          <ChartSubtitle>
            {`${pluralizeWordWithCount(totalSampleUnits || 0, 'Sample unit')}`}
          </ChartSubtitle>
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
