import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWord, pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

const BIN_SIZE = 100
const START_BIN = 0
const END_BIN = 5000

export const AggregateFishBiomass = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateFishBeltToggleOn =
    !omittedMethodDataSharingFilters.includes('bf_3') &&
    omittedMethodDataSharingFilters.includes('bf_2') &&
    omittedMethodDataSharingFilters.includes('bf_1')

  const surveyFishbeltBiomassValues = filteredSurveys
    .map((record) => record.protocols?.beltfish?.biomass_kgha_avg)
    .filter((record) => record !== undefined && record !== null)

  const maxXValue = Math.max(...surveyFishbeltBiomassValues)
  const hasValuesAbove5000 = maxXValue > 5000

  const binStartValues = Array.from(
    { length: (END_BIN - START_BIN) / BIN_SIZE },
    (_, index) => START_BIN + index * BIN_SIZE,
  )
  const filtered5000OrMoreSurveys = surveyFishbeltBiomassValues
    .filter((value) => value > 5000)
    .map(() => 5000)

  const lessThan5000Data = binStartValues.map((binStartValue) => {
    const binEndValue = binStartValue + BIN_SIZE
    const binEndValueDisplay = binEndValue - 0.1
    const xValues = surveyFishbeltBiomassValues.filter(
      (value) => value <= 5000 && value >= binStartValue && value < binEndValue,
    )
    const surveyCountText = pluralizeWord(xValues.length, 'survey')

    return {
      x: xValues,
      type: 'histogram',
      name: '',
      marker: {
        color: plotlyChartTheme.aggregateCharts.default.marker.color,
      },
      xbins: { start: binStartValue, end: binEndValue, size: BIN_SIZE },
      hovertemplate: `Bin: ${binStartValue} - ${binEndValueDisplay} kg/ha<br>%{y:,} ${surveyCountText}`,
      showlegend: false,
    }
  })

  const plotlyDataConfiguration = [
    ...lessThan5000Data,
    {
      x: filtered5000OrMoreSurveys,
      type: 'histogram',
      name: '',
      marker: {
        color: plotlyChartTheme.aggregateCharts.default.marker.color,
      },
      xbins: { start: 5000, end: 5100, size: 100 },
      hovertemplate: `Bin: 5000+kg/ha<br>%{y} ${pluralizeWord(filtered5000OrMoreSurveys.length, 'survey')}`,
      showlegend: false,
    },
  ].filter((trace) => trace.x && trace.x.length > 0)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Fish biomass (kg/ha)',
      },
      tickmode: hasValuesAbove5000 ? 'array' : 'auto',
      tickvals: hasValuesAbove5000 ? [0, 1000, 2000, 3000, 4000, 5000] : [],
      ticktext: hasValuesAbove5000 ? ['0', '1000', '2000', '3000', '4000', '5000+'] : [],
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: 'Number of surveys' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass</MetricCardH3>
        {!privateFishBeltToggleOn && (
          <ChartSubtitle>
            {`${pluralizeWordWithCount(surveyFishbeltBiomassValues.length || 0, 'Survey')}`}
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateFishBeltToggleOn ? (
        <PrivateChartView />
      ) : surveyFishbeltBiomassValues.length > 0 ? (
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
