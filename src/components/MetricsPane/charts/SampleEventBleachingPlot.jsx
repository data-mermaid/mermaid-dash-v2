import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart
const bleachingBenthicCategories = Object.entries(
  chartTheme.chartCategoryType.bleachingBenthicColorMap,
)

export const SampleEventBleachingPlot = ({ bleachingData }) => {
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

  const totalSurveys = isBleachingDataAvailable ? quadratCount * sampleUnitCount : 0
  const otherBleachingPercentage = isBleachingDataAvailable
    ? parseFloat((100 - percentHard - percentSoft - percentAlgae).toFixed(1))
    : undefined

  const bleachingPercentageValues = [
    percentAlgae ?? 0,
    percentSoft ?? 0,
    otherBleachingPercentage ?? 0,
    percentHard ?? 0,
  ]

  const plotlyDataConfiguration = bleachingBenthicCategories
    .map(([category, color], index) => ({
      x: [1],
      y: [bleachingPercentageValues[index] / 100],
      type: 'bar',
      name: `${category} (${bleachingPercentageValues[index]}%)`,
      marker: {
        color: color,
      },
    }))
    .filter((trace) => trace.y.some((value) => value > 0))

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
        <MetricCardH3>Bleaching - % Benthic Cover</MetricCardH3>
        {isBleachingDataAvailable && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
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
