import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart
const chartThemeLayout = chartTheme.layout

export const TimeSeriesHabitatComplexity = () => {
  const { filteredSurveys, methodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateHabitatComplexityToggleOn =
    !methodDataSharingFilters.includes('hc_3') &&
    methodDataSharingFilters.includes('hc_2') &&
    methodDataSharingFilters.includes('hc_1')

  const surveyedHabitatComplexityRecords = filteredSurveys
    .filter(
      (record) =>
        record.protocols?.habitatcomplexity?.score_avg_avg !== undefined &&
        record.protocols?.habitatcomplexity?.score_avg_avg !== null,
    )
    .map((record) => ({
      sampleDate: record.sample_date,
      roundComplexityScore: Math.round(record.protocols.habitatcomplexity.score_avg_avg),
    }))

  const groupedComplexityCountByYearScore = surveyedHabitatComplexityRecords.reduce(
    (accumulator, record) => {
      const { sampleDate, roundComplexityScore } = record
      const year = new Date(sampleDate).getFullYear()
      const key = `${year}-${roundComplexityScore}`

      if (!accumulator[key]) {
        accumulator[key] = { year, roundComplexityScore, count: 0 }
      }

      accumulator[key].count += 1
      return accumulator
    },
    {},
  )

  const complexityScoreCountByYear = Object.values(groupedComplexityCountByYearScore).reduce(
    (accumulator, { year, roundComplexityScore, count }) => {
      if (!accumulator[year]) {
        accumulator[year] = { year, total: 0, complexityScoreDistribution: {} }
      }

      accumulator[year].total += count
      accumulator[year].complexityScoreDistribution[roundComplexityScore] = count
      return accumulator
    },
    {},
  )

  const complexityScoreDistributions = Object.values(complexityScoreCountByYear).flatMap(
    ({ year, total, complexityScoreDistribution }) =>
      Object.entries(complexityScoreDistribution).map(([roundComplexityScore, count]) => ({
        year,
        roundComplexityScore,
        percentage: (count / total) * 100,
      })),
  )

  const uniqueComplexityScores = [
    ...new Set(
      complexityScoreDistributions.map((distribution) => distribution.roundComplexityScore),
    ),
  ]

  const plotlyDataConfiguration = uniqueComplexityScores
    .sort((a, b) => Number(a) - Number(b))
    .map((score) => ({
      x: complexityScoreDistributions
        .filter((distribution) => distribution.roundComplexityScore === score)
        .map((distribution) => distribution.year),
      y: complexityScoreDistributions
        .filter((distribution) => distribution.roundComplexityScore === score)
        .map((distribution) => distribution.percentage),
      type: 'bar',
      name: score,
      marker: { color: chartTheme.chartCategoryType.habitatComplexityColorMap[score] },
      hovertemplate: '%{x}, %{y:.2f}',
    }))

  const plotlyLayoutConfiguration = {
    ...chartThemeLayout,
    barmode: 'stack',
    xaxis: {
      ...chartThemeLayout.xaxis,
      title: {
        ...chartThemeLayout.xaxis.title,
        text: 'Year',
      },
    },
    yaxis: {
      ...chartThemeLayout.yaxis,
      title: { ...chartThemeLayout.yaxis.title, text: '% of Surveys' },
    },
    showlegend: true,
    legend: chartTheme.horizontalLegend,
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Habitat Complexity</MetricCardH3>
        {!privateHabitatComplexityToggleOn && (
          <ChartSubtitle>
            {surveyedHabitatComplexityRecords.length.toLocaleString()} Surveys
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      {privateHabitatComplexityToggleOn ? (
        <PrivateChartView />
      ) : surveyedHabitatComplexityRecords.length > 0 ? (
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
