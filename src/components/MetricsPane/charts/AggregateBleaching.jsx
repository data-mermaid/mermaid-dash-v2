import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

export const AggregateBleaching = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateBleachingToggleOn =
    !omittedMethodDataSharingFilters.includes('cb_3') &&
    omittedMethodDataSharingFilters.includes('cb_2') &&
    omittedMethodDataSharingFilters.includes('cb_1')

  const initialColoniesBleachedSummarizedBySeverity = {
    numColoniesTotal: 0,
    totalColoniesNormal: 0,
    totalColoniesPale: 0,
    totalColonies0to20: 0,
    totalColonies20to50: 0,
    totalColonies50to80: 0,
    totalColonies80to100: 0,
    totalColoniesDead: 0,
  }
  const coloniesBleachedSummarizedBySeverity = filteredSurveys
    .filter((record) => !!record.protocols?.colonies_bleached)
    .reduce((accumulator, record) => {
      const {
        count_total_avg,
        percent_100_avg,
        percent_20_avg,
        percent_50_avg,
        percent_80_avg,
        percent_dead_avg,
        percent_normal_avg,
        percent_pale_avg,
        sample_unit_count,
      } = record.protocols.colonies_bleached
      const numColoniesTotalForRecord = count_total_avg * sample_unit_count

      if (isNaN(numColoniesTotalForRecord)) {
        return accumulator
      }

      const totalColoniesNormal =
        (numColoniesTotalForRecord * percent_normal_avg) / 100 +
        (accumulator.totalColoniesNormal ?? 0)
      const totalColoniesPale =
        (numColoniesTotalForRecord * percent_pale_avg) / 100 + (accumulator.totalColoniesPale ?? 0)
      const totalColonies0to20 =
        (numColoniesTotalForRecord * percent_20_avg) / 100 + (accumulator.totalColonies0to20 ?? 0)
      const totalColonies20to50 =
        (numColoniesTotalForRecord * percent_50_avg) / 100 + (accumulator.totalColonies20to50 ?? 0)
      const totalColonies50to80 =
        (numColoniesTotalForRecord * percent_80_avg) / 100 + (accumulator.totalColonies50to80 ?? 0)
      const totalColonies80to100 =
        (numColoniesTotalForRecord * percent_100_avg) / 100 +
        (accumulator.totalColonies80to100 ?? 0)
      const totalColoniesDead =
        (numColoniesTotalForRecord * percent_dead_avg) / 100 + (accumulator.totalColoniesDead ?? 0)

      return {
        numColoniesTotal: numColoniesTotalForRecord + accumulator.numColoniesTotal,
        totalColoniesNormal,
        totalColoniesPale,
        totalColonies0to20,
        totalColonies20to50,
        totalColonies50to80,
        totalColonies80to100,
        totalColoniesDead,
      }
    }, initialColoniesBleachedSummarizedBySeverity)

  const {
    numColoniesTotal,
    totalColoniesPale,
    totalColonies0to20,
    totalColonies20to50,
    totalColonies50to80,
    totalColonies80to100,
    totalColoniesDead,
    totalColoniesNormal,
  } = coloniesBleachedSummarizedBySeverity

  const plotlyDataConfiguration = [
    {
      y: [
        totalColoniesNormal,
        totalColoniesPale,
        totalColonies0to20,
        totalColonies20to50,
        totalColonies50to80,
        totalColonies80to100,
        totalColoniesDead,
      ],
      x: ['Normal', 'Pale', '0-20%', '20-50%', '50-80%', '80-100%', 'Dead'],
      type: 'bar',
      marker: {
        color: plotlyChartTheme.aggregateCharts.bleaching.marker.color,
      },
      xbins: {
        size: 100,
      },
      hovertemplate: '<b>%{x}</b><br>%{y:.1f} colonies',
    },
  ]

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    margin: { ...plotlyChartTheme.layout.margin, b: 60 },
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Bleaching severity',
      },
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: {
        ...plotlyChartTheme.layout.yaxis.title,
        text: 'Number of coral colonies',
      },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Bleaching</MetricCardH3>
        {!privateBleachingToggleOn && (
          <ChartSubtitle>{Math.round(numColoniesTotal).toLocaleString()} Colonies</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateBleachingToggleOn ? (
        <PrivateChartView />
      ) : numColoniesTotal > 0 ? (
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
