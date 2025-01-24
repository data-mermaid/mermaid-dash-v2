import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const TimeSeriesHabitatComplexity = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const habitatComplexityAvgScoreAndYear = filteredSurveys
    .filter((item) => item.protocols?.habitatcomplexity?.score_avg_avg !== undefined)
    .map((item) => ({
      sampleDate: item.sample_date,
      roundAvgHabitatComplexityScore: Math.round(item.protocols.habitatcomplexity.score_avg_avg),
    }))

  const habitatComplexityGroupByYearScore = habitatComplexityAvgScoreAndYear.reduce(
    (acc, { sampleDate, roundAvgHabitatComplexityScore }) => {
      const year =
        new Date(sampleDate).getFullYear() < 1900 ? 2024 : new Date(sampleDate).getFullYear()
      const key = `${year}-${roundAvgHabitatComplexityScore}`

      acc[key] = acc[key] || { year, roundAvgHabitatComplexityScore, count: 0 }
      acc[key].count += 1
      return acc
    },
    {},
  )

  const habitatComplexityScoreCountGroupByYear = Object.values(
    habitatComplexityGroupByYearScore,
  ).reduce((acc, { year, roundAvgHabitatComplexityScore, count }) => {
    acc[year] = acc[year] || { year, total: 0, complexityCounts: {} }
    acc[year].total += count
    acc[year].complexityCounts[roundAvgHabitatComplexityScore] = count
    return acc
  }, {})

  const chartData = Object.values(habitatComplexityScoreCountGroupByYear).flatMap(
    ({ year, total, complexityCounts }) =>
      Object.entries(complexityCounts).map(([roundAvgHabitatComplexityScore, count]) => ({
        year,
        roundAvgHabitatComplexityScore,
        percentage: (count / total) * 100,
      })),
  )

  const uniqueComplexities = [
    ...new Set(
      chartData.map(({ roundAvgHabitatComplexityScore }) => roundAvgHabitatComplexityScore),
    ),
  ]
  const plotlyDataConfiguration = uniqueComplexities.map((complexityScore) => ({
    x: chartData
      .filter((d) => d.roundAvgHabitatComplexityScore === complexityScore)
      .map((d) => d.year),
    y: chartData
      .filter((d) => d.roundAvgHabitatComplexityScore === complexityScore)
      .map((d) => d.percentage),
    type: 'bar',
    name: `${complexityScore}`,
    marker: { color: chartTheme.timeseriesCharts.habitatComplexityColorMap[complexityScore] },
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
          {habitatComplexityAvgScoreAndYear.length.toLocaleString()} Surveys
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
