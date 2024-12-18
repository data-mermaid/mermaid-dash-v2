import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const AggregateFishBiomass = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const surveyFishbeltBiomassValues = filteredSurveys
    .map((record) => record.protocols?.beltfish?.biomass_kgha_avg)
    .filter(Boolean)

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass (KG/HA) </MetricCardH3>
        <ChartSubtitle>{surveyFishbeltBiomassValues.length} Surveys</ChartSubtitle>
      </TitlesWrapper>

      <Plot
        data={[
          {
            x: surveyFishbeltBiomassValues,
            type: 'histogram',
            marker: {
              color: chartTheme.aggregateCharts.default.marker.color,
            },
            xbins: {
              size: 100,
            },
          },
        ]}
        layout={{
          ...chartTheme.layout,
          xaxis: {
            ...chartTheme.layout.xaxis,
            title: {
              ...chartTheme.layout.xaxis.title,
              text: 'Fish biomass (kg/ha)',
            },
          },
          yaxis: {
            ...chartTheme.layout.yaxis,
            title: { ...chartTheme.layout.yaxis.title, text: 'Number of surveys' },
          },
        }}
        config={chartTheme.config}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartWrapper>
  )
}
