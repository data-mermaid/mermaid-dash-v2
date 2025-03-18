import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const BIN_SIZE = 2
const START_BIN = 0
const END_BIN = 100

export const AggregateHardCoralCover = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateBenthicFilters = ['bl_3', 'bp_3', 'qbp_3']
  const otherBenthicFilters = ['bl_1', 'bl_2', 'bp_1', 'bp_2', 'qbp_1', 'qbp_2']

  const privateBenthicToggleOn =
    privateBenthicFilters.some((filter) => !omittedMethodDataSharingFilters.includes(filter)) &&
    otherBenthicFilters.every((filter) => omittedMethodDataSharingFilters.includes(filter))

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

  const binStartValues = Array.from(
    { length: (END_BIN - START_BIN) / BIN_SIZE },
    (_, index) => START_BIN + index * BIN_SIZE,
  )

  const binColors = binStartValues.map((binStartValue) => {
    const markerColors = plotlyChartTheme.aggregateCharts.hardCoralCover.marker

    if (binStartValue < 10) {
      return markerColors.low
    }

    if (binStartValue >= 10 && binStartValue < 30) {
      return markerColors.medium
    }

    return markerColors.high
  })

  const plotlyDataConfiguration = binStartValues
    .map((binStartValue, index) => ({
      x: hardCoralAveragesPerSurvey.filter(
        (val) => val >= binStartValue && val < binStartValue + BIN_SIZE,
      ),
      type: 'histogram',
      name: '',
      marker: {
        color: binColors[index],
      },
      xbins: { start: binStartValue, end: binStartValue + BIN_SIZE, size: BIN_SIZE },
      showlegend: false,
    }))
    .filter((trace) => trace.x && trace.x.length > 0)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: '% Hard Coral Cover',
      },
      tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: 'Number of surveys' },
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
      <HorizontalLine />
      {privateBenthicToggleOn ? (
        <PrivateChartView />
      ) : hardCoralAveragesPerSurvey.length > 0 ? (
        <Plot
          data={plotlyDataConfiguration}
          layout={plotlyLayoutConfiguration}
          config={plotlyChartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <NoDataChartView />
      )}
    </ChartWrapper>
  )
}
