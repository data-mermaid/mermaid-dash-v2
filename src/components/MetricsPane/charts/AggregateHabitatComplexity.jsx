import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

export const AggregateHabitatComplexity = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateHabitatComplexityToggleOn =
    !omittedMethodDataSharingFilters.includes('hc_3') &&
    omittedMethodDataSharingFilters.includes('hc_2') &&
    omittedMethodDataSharingFilters.includes('hc_1')

  const habitatComplexityValues = filteredSurveys
    .map((record) => record.protocols.habitatcomplexity?.score_avg_avg)
    .filter((record) => record !== undefined && record !== null)

  const plotlyDataConfiguration = [
    {
      x: habitatComplexityValues,
      type: 'histogram',
      marker: {
        color: plotlyChartTheme.aggregateCharts.default.marker.color,
      },
      xbins: {
        size: 1,
      },
    },
  ]
  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Score',
      },
      tickvals: [0, 1, 2, 3, 4, 5],
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: 'Number of surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Habitat Complexity </MetricCardH3>
        {!privateHabitatComplexityToggleOn && (
          <ChartSubtitle>{habitatComplexityValues.length.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
      {privateHabitatComplexityToggleOn ? (
        <PrivateChartView />
      ) : habitatComplexityValues.length > 0 ? (
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
