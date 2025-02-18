import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const AggregateFishBiomass = () => {
  const { filteredSurveys, methodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateFishBeltToggleOn =
    !methodDataSharingFilters.includes('bf_3') &&
    methodDataSharingFilters.includes('bf_2') &&
    methodDataSharingFilters.includes('bf_1')

  const surveyFishbeltBiomassValues = filteredSurveys
    .map((record) => record.protocols?.beltfish?.biomass_kgha_avg)
    .filter((record) => record !== undefined && record !== null)

  const maxXValue = Math.max(...surveyFishbeltBiomassValues)
  const hasValuesAbove5000 = maxXValue > 5000

  const plotlyDataConfiguration = [
    {
      x: surveyFishbeltBiomassValues.filter((value) => value <= 5000),
      type: 'histogram',
      name: '',
      marker: {
        color: chartTheme.aggregateCharts.default.marker.color,
      },
      xbins: { start: 0, end: 5000, size: 100 },
      hovertemplate: '%{x} kg/ha<br>%{y} surveys',
      showlegend: false,
    },
    {
      x: surveyFishbeltBiomassValues.filter((value) => value > 5000).map(() => 5000),
      type: 'histogram',
      name: '',
      marker: {
        color: chartTheme.aggregateCharts.default.marker.color,
      },
      xbins: { start: 5000, end: 5100, size: 100 },
      hovertemplate: '5000+ kg/ha<br>%{y} surveys',
      showlegend: false,
    },
  ].filter((trace) => trace.x && trace.x.length > 0)

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Fish biomass (kg/ha)',
      },
      tickmode: hasValuesAbove5000 ? 'array' : 'auto',
      tickvals: hasValuesAbove5000 ? [0, 1000, 2000, 3000, 4000, 5000] : [],
      ticktext: hasValuesAbove5000 ? ['0', '1000', '2000', '3000', '4000', '5000+'] : [],
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass (KG/HA) </MetricCardH3>
        {!privateFishBeltToggleOn && (
          <ChartSubtitle>
            {surveyFishbeltBiomassValues.length.toLocaleString()} Surveys
          </ChartSubtitle>
        )}
      </TitlesWrapper>{' '}
      {privateFishBeltToggleOn ? (
        <PrivateChartView />
      ) : surveyFishbeltBiomassValues.length > 0 ? (
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
