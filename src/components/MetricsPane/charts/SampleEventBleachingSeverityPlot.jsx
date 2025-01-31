import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const bleachingSeverityCategories = chartTheme.sampleEventCharts.bleachingSeverity
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

  const totalSurveys = countTotalAvg > 0 ? countTotalAvg * sampleUnitCount : 0

  const bleachingCategories = [
    { key: 'percent_normal_avg', label: 'Normal', color: '#3c6e9a' },
    { key: 'percent_pale_avg', label: 'Pale', color: '#6288ad' },
    { key: 'percent_20_avg', label: '0-20% bleached', color: '#85a3c1' },
    { key: 'percent_50_avg', label: '20-50% bleached', color: '#a8bed5' },
    { key: 'percent_80_avg', label: '50-80% bleached', color: '#cbdaea' },
    { key: 'percent_100_avg', label: '80-100% bleached', color: '#eff7ff' },
    { key: 'percent_dead_avg', label: 'Recently dead', color: '#b4b4b4' },
  ]

  const plotlyDataConfiguration = [
    {
      x: [1],
      y: [percentNormal / 100],
      type: 'bar',
      name: `Normal (${percentNormal}%)`,
      marker: { color: bleachingSeverityCategories.percent_normal_avg },
    },
    {
      x: [1],
      y: [percentPale / 100],
      type: 'bar',
      name: `Pale (${percentPale}%)`,
      marker: { color: bleachingSeverityCategories.percent_pale_avg },
    },
    {
      y: [percent20 / 100],
      x: [1],
      type: 'bar',
      name: `0-20% bleached (${percent20}%)`,
      marker: { color: bleachingSeverityCategories.percent_20_avg },
    },
    {
      x: [1],
      y: [percent50 / 100],
      type: 'bar',
      name: `20-50% bleached (${percent50}%)`,
      marker: { color: bleachingSeverityCategories.percent_50_avg },
    },
    {
      x: [1],
      y: [percent80 / 100],
      type: 'bar',
      name: `50-80% bleached (${percent80}%)`,
      marker: { color: bleachingSeverityCategories.percent_80_avg },
    },
    {
      x: [1],
      y: [percent100 / 100],
      type: 'bar',
      name: `80-100% bleached (${percent100}%)`,
      marker: { color: bleachingSeverityCategories.percent_100_avg },
    },
    {
      x: [1],
      y: [percentDead / 100],
      type: 'bar',
      name: `Recently dead (${percentDead}%)`,
      marker: { color: bleachingSeverityCategories.percent_dead_avg },
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
