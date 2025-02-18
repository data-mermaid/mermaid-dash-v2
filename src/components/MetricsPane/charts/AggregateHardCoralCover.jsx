import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart
const binSize = 2
const start = 0
const end = 100

export const AggregateHardCoralCover = () => {
  const { filteredSurveys, methodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateBenthicFilters = ['bl_3', 'bp_3', 'qbp_3']
  const otherBenthicFilters = ['bl_1', 'bl_2', 'bp_1', 'bp_2', 'qbp_1', 'qbp_2']

  const privateBenthicToggleOn =
    privateBenthicFilters.some((filter) => !methodDataSharingFilters.includes(filter)) &&
    otherBenthicFilters.every((filter) => methodDataSharingFilters.includes(filter))

  const hardCoralAveragesPerSurvey = filteredSurveys
    .map(({ protocols }) => {
      const getHardCoralCover = (data, protocol) =>
        data?.[protocol]?.percent_cover_benthic_category_avg?.['Hard coral']

      const benthicPitCover = getHardCoralCover(protocols, 'benthicpit')
      const benthicLitCover = getHardCoralCover(protocols, 'benthiclit')
      const benthicPqtCover = getHardCoralCover(protocols, 'benthicpqt')
      const quadratBenthicCover = protocols?.quadrat_benthic_percent?.percent_hard_avg_avg

      if (
        benthicPitCover === undefined &&
        benthicLitCover === undefined &&
        benthicPqtCover === undefined &&
        quadratBenthicCover === undefined
      ) {
        return undefined
      }

      const benthicCovers = [
        benthicPitCover ?? 0,
        benthicLitCover ?? 0,
        benthicPqtCover ?? 0,
        quadratBenthicCover ?? 0,
      ]

      const numerator = benthicCovers.reduce((sum, value) => sum + value, 0)
      const denominator = [
        benthicPitCover,
        benthicLitCover,
        benthicPqtCover,
        quadratBenthicCover,
      ].filter((value) => value !== undefined).length

      return numerator / denominator
    })
    .filter((record) => record !== undefined)

  const bins = Array.from({ length: (end - start) / binSize }, (_, i) => start + i * binSize)

  const binColors = bins.map((bin) => {
    const markerColors = chartTheme.aggregateCharts.hardCoralCover.marker

    if (bin < 10) {
      return markerColors.low
    }

    if (bin >= 10 && bin < 30) {
      return markerColors.medium
    }

    return markerColors.high
  })

  const plotlyDataConfiguration = bins
    .map((bin, index) => ({
      x: hardCoralAveragesPerSurvey.filter((val) => val >= bin && val < bin + binSize),
      type: 'histogram',
      name: '',
      marker: {
        color: binColors[index],
      },
      xbins: { start: bin, end: bin + binSize, size: binSize },
      showlegend: false,
    }))
    .filter((trace) => trace.x && trace.x.length > 0)

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: '% Hard Coral Cover',
      },
      tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Hard Coral Cover</MetricCardH3>
        {!privateBenthicToggleOn && (
          <ChartSubtitle>
            {hardCoralAveragesPerSurvey.length.toLocaleString()} Surveys
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      {privateBenthicToggleOn ? (
        <PrivateChartView />
      ) : hardCoralAveragesPerSurvey.length > 0 ? (
        <Plot
          data={plotlyDataConfiguration}
          layout={plotlyLayoutConfiguration}
          config={chartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <NoDataChartView />
      )}
    </ChartWrapper>
  )
}
