import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const TimeSeriesHabitatComplexity = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

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

  const plotlyDataConfiguration = uniqueComplexityScores.map((score) => ({
    x: complexityScoreDistributions
      .filter((distribution) => distribution.roundComplexityScore === score)
      .map((distribution) => distribution.year),
    y: complexityScoreDistributions
      .filter((distribution) => distribution.roundComplexityScore === score)
      .map((distribution) => distribution.percentage),
    type: 'bar',
    name: score,
    marker: { color: chartTheme.timeseriesCharts.habitatComplexityColorMap[score] },
  }))

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    barmode: 'stack',
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Year',
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: '% of Surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Habitat Complexity</MetricCardH3>
        <ChartSubtitle>
          {surveyedHabitatComplexityRecords.length.toLocaleString()} Surveys
        </ChartSubtitle>
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
