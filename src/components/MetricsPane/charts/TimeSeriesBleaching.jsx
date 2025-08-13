import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'
import { checkXSeriesYears } from '../../../helperFunctions/chartHelpers'

const bleachingColor = plotlyChartTheme.chartCategoryType.bleachingColorMap

export const TimeSeriesBleaching = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateBleachingToggleOn =
    !omittedMethodDataSharingFilters.includes('cb_3') &&
    omittedMethodDataSharingFilters.includes('cb_2') &&
    omittedMethodDataSharingFilters.includes('cb_1')

  const groupedBleachingPercentageColonyCountByYear = filteredSurveys
    .filter((record) => !!record.protocols?.colonies_bleached)
    .reduce((accumulator, { sample_date, protocols }) => {
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

      if (!countTotalAvg) {
        return accumulator
      }

      const numColoniesTotal = countTotalAvg * sampleUnitCount

      if (!accumulator[year]) {
        accumulator[year] = {
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
      const updateTotalColonies = (category, percentage) => {
        accumulator[year][category] += (numColoniesTotal * (percentage ?? 0)) / 100
      }

      updateTotalColonies('totalColoniesNormal', percentNormal)
      updateTotalColonies('totalColoniesPale', percentPale)
      updateTotalColonies('totalColonies0to20', percent20)
      updateTotalColonies('totalColonies20to50', percent50)
      updateTotalColonies('totalColonies50to80', percent80)
      updateTotalColonies('totalColonies80to100', percent100)
      updateTotalColonies('totalColoniesDead', percentDead)
      accumulator[year].totalAllColonies += numColoniesTotal

      return accumulator
    }, {})

  const bleachingPercentageColonyDistributions = Object.values(
    groupedBleachingPercentageColonyCountByYear,
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

  const years = bleachingPercentageColonyDistributions.map((distribution) => distribution.year)
  const totalSurveys = bleachingPercentageColonyDistributions.reduce(
    (sum, { totalAllColonies }) => sum + totalAllColonies,
    0,
  )

  const plotlyDataConfiguration = [
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColoniesNormal,
      ),
      name: 'Normal',
      type: 'bar',
      marker: { color: bleachingColor.Normal },
      hovertemplate:
        'Bleaching severity: Normal<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColoniesPale,
      ),
      name: 'Pale',
      type: 'bar',
      marker: { color: bleachingColor.Pale },
      hovertemplate:
        'Bleaching severity: Pale<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColonies0to20,
      ),
      name: '0-20%',
      type: 'bar',
      marker: { color: bleachingColor['0-20%'] },
      hovertemplate:
        'Bleaching severity: 0-20%<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColonies20to50,
      ),
      name: '20-50%',
      type: 'bar',
      marker: { color: bleachingColor['20-50%'] },
      hovertemplate:
        'Bleaching severity: 20-50%<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColonies50to80,
      ),
      name: '50-80%',
      type: 'bar',
      marker: { color: bleachingColor['50-80%'] },
      hovertemplate:
        'Bleaching severity: 50-80%<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColonies80to100,
      ),
      name: '80-100%',
      type: 'bar',
      marker: { color: bleachingColor['80-100%'] },
      hovertemplate:
        'Bleaching severity: 80-100%<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
    {
      x: years,
      y: bleachingPercentageColonyDistributions.map(
        (distribution) => distribution.percentColoniesDead,
      ),
      name: 'Dead',
      type: 'bar',
      marker: { color: bleachingColor.Dead },
      hovertemplate:
        'Bleaching severity: Dead<br>Year: %{x}<br>%{y:.1f}% of colonies<extra></extra>',
    },
  ].filter((trace) => trace.y.some((value) => value > 0))

  const allSeriesHaveFewerThanThreeYears = checkXSeriesYears(plotlyDataConfiguration)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    barmode: 'stack',
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Year',
      },
      type: allSeriesHaveFewerThanThreeYears ? 'category' : 'linear',
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: '% of colonies' },
    },
    showlegend: true,
    legend: {
      ...plotlyChartTheme.horizontalLegend,
      title: {
        text: 'Bleaching severity:',
        side: 'top',
        font: {
          size: 12,
        },
      },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Bleaching</MetricCardH3>
        {!privateBleachingToggleOn && (
          <ChartSubtitle>{`${pluralizeWordWithCount(totalSurveys ?? 0, 'Colony', 'Colonies')}`}</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateBleachingToggleOn ? (
        <PrivateChartView />
      ) : totalSurveys > 0 ? (
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
