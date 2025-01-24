import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const TimeSeriesBleaching = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const bleachingColoniesGroupByYear = filteredSurveys.reduce((acc, event) => {
    const { sample_date, protocols } = event
    if (!protocols || !protocols.colonies_bleached) return acc

    const year = new Date(sample_date).getFullYear()
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
    } = protocols.colonies_bleached

    if (!countTotalAvg || !sampleUnitCount) return acc

    const numColoniesTotal = countTotalAvg * sampleUnitCount

    if (!acc[year]) {
      acc[year] = {
        year,
        totalColoniesNormal: 0,
        totalColoniesPale: 0,
        totalColonies0to20: 0,
        totalColonies20to50: 0,
        totalColonies50to80: 0,
        totalColonies80to100: 0,
        totalColoniesDead: 0,
        totalAllColonies: 0,
      }
    }

    acc[year].totalColoniesNormal += (numColoniesTotal * (percentNormal || 0)) / 100
    acc[year].totalColoniesPale += (numColoniesTotal * (percentPale || 0)) / 100
    acc[year].totalColonies0to20 += (numColoniesTotal * (percent20 || 0)) / 100
    acc[year].totalColonies20to50 += (numColoniesTotal * (percent50 || 0)) / 100
    acc[year].totalColonies50to80 += (numColoniesTotal * (percent80 || 0)) / 100
    acc[year].totalColonies80to100 += (numColoniesTotal * (percent100 || 0)) / 100
    acc[year].totalColoniesDead += (numColoniesTotal * (percentDead || 0)) / 100
    acc[year].totalAllColonies += numColoniesTotal

    return acc
  }, {})

  const bleachingColoniesWithPercentageGroupByYear = Object.values(
    bleachingColoniesGroupByYear,
  ).map((yearData) => ({
    ...yearData,
    percentColoniesNormal: (yearData.totalColoniesNormal / yearData.totalAllColonies) * 100,
    percentColoniesPale: (yearData.totalColoniesPale / yearData.totalAllColonies) * 100,
    percentColonies0to20: (yearData.totalColonies0to20 / yearData.totalAllColonies) * 100,
    percentColonies20to50: (yearData.totalColonies20to50 / yearData.totalAllColonies) * 100,
    percentColonies50to80: (yearData.totalColonies50to80 / yearData.totalAllColonies) * 100,
    percentColonies80to100: (yearData.totalColonies80to100 / yearData.totalAllColonies) * 100,
    percentColoniesDead: (yearData.totalColoniesDead / yearData.totalAllColonies) * 100,
  }))

  const sumOfTotalAllColonies = bleachingColoniesWithPercentageGroupByYear.reduce((acc, data) => {
    acc += data.totalAllColonies
    return acc
  }, 0)
  const years = bleachingColoniesWithPercentageGroupByYear.map((data) => data.year)
  const bleachingColor = chartTheme.timeseriesCharts.bleachingColor
  const plotlyDataConfiguration = [
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColoniesNormal),
      name: 'Normal',
      type: 'bar',
      marker: { color: bleachingColor.Normal },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColoniesPale),
      name: 'Pale',
      type: 'bar',
      marker: { color: bleachingColor.Pale },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColonies0to20),
      name: '0-20%',
      type: 'bar',
      marker: { color: bleachingColor['0-20%'] },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColonies20to50),
      name: '20-50%',
      type: 'bar',
      marker: { color: bleachingColor['20-50%'] },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColonies50to80),
      name: '50-80%',
      type: 'bar',
      marker: { color: bleachingColor['50-80%'] },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColonies80to100),
      name: '80-100%',
      type: 'bar',
      marker: { color: bleachingColor['80-100%'] },
    },
    {
      x: years,
      y: bleachingColoniesWithPercentageGroupByYear.map((data) => data.percentColoniesDead),
      name: 'Dead',
      type: 'bar',
      marker: { color: bleachingColor.Dead },
    },
  ]

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
      title: { ...chartTheme.layout.yaxis.title, text: '% of Colonies' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Bleaching</MetricCardH3>
        <ChartSubtitle>{Math.round(sumOfTotalAllColonies).toLocaleString()} Colonies</ChartSubtitle>
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
