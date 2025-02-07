import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const AggregateHabitatComplexity = () => {
  const { filteredSurveys, methodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateHabitatComplexityToggleOn =
    !methodDataSharingFilters.includes('hc_3') &&
    methodDataSharingFilters.includes('hc_2') &&
    methodDataSharingFilters.includes('hc_1')

  const habitatComplexityValues = filteredSurveys
    .map((record) => record.protocols.habitatcomplexity?.score_avg_avg)
    .filter((record) => record !== undefined && record !== null)

  const plotlyDataConfiguration = [
    {
      x: habitatComplexityValues,
      type: 'histogram',
      marker: {
        color: chartTheme.aggregateCharts.default.marker.color,
      },
      xbins: {
        size: 1,
      },
    },
  ]
  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Score',
      },
      tickvals: [0, 1, 2, 3, 4, 5],
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
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
          config={chartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <NoDataChartView />
      )}
    </ChartWrapper>
  )
}
