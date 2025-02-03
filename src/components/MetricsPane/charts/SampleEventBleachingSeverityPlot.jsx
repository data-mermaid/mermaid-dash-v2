import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const bleachingColor = chartTheme.chartCategoryType.bleachingColorMap
export const SampleEventBleachingSeverityPlot = ({ coloniesBleachedData }) => {
  const totalSurveys = countTotalAvg > 0 ? countTotalAvg * sampleUnitCount : 0
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

  const plotlyDataConfiguration = [
    {
      x: [1],
      y: [percentDead / 100],
      type: 'bar',
      name: `Recently dead (${percentDead}%)`,
      marker: { color: bleachingColor['Dead'] },
    },
    {
      x: [1],
      y: [percent100 / 100],
      type: 'bar',
      name: `80-100% bleached (${percent100}%)`,
      marker: { color: bleachingColor['80-100%'] },
    },
    {
      x: [1],
      y: [percent80 / 100],
      type: 'bar',
      name: `50-80% bleached (${percent80}%)`,
      marker: { color: bleachingColor['50-80%'] },
    },
    {
      x: [1],
      y: [percent50 / 100],
      type: 'bar',
      name: `20-50% bleached (${percent50}%)`,
      marker: { color: bleachingColor['20-50%'] },
    },
    {
      y: [percent20 / 100],
      x: [1],
      type: 'bar',
      name: `0-20% bleached (${percent20}%)`,
      marker: { color: bleachingColor['0-20%'] },
    },
    {
      x: [1],
      y: [percentPale / 100],
      type: 'bar',
      name: `Pale (${percentPale}%)`,
      marker: { color: bleachingColor['Pale'] },
    },
    {
      x: [1],
      y: [percentNormal / 100],
      type: 'bar',
      name: `Normal (${percentNormal}%)`,
      marker: { color: bleachingColor['Normal'] },
    },
  ].filter((trace) => trace.y.some((value) => value > 0))

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
        <MetricCardH3>Bleaching - Severity</MetricCardH3>
        <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
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
