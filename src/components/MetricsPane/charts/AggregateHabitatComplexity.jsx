import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWord, pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

const BIN_SIZE = 1
const START_BIN = -0.5
const END_BIN = 5.5

export const AggregateHabitatComplexity = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateHabitatComplexityToggleOn =
    !omittedMethodDataSharingFilters.includes('hc_3') &&
    omittedMethodDataSharingFilters.includes('hc_2') &&
    omittedMethodDataSharingFilters.includes('hc_1')

  const habitatComplexityValues = filteredSurveys
    .map((record) => record.protocols.habitatcomplexity?.score_avg_avg)
    .filter((record) => record !== undefined && record !== null)

  const binStartValues = Array.from(
    { length: (END_BIN - START_BIN) / BIN_SIZE },
    (_, index) => START_BIN + index * BIN_SIZE,
  )

  const plotlyDataConfiguration = binStartValues
    .map((binStartValue) => {
      const binEndValue = binStartValue + BIN_SIZE
      const binEndValueDisplay = binEndValue - 0.1
      const xValues = habitatComplexityValues.filter(
        (value) => value >= binStartValue && value < binEndValue,
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
        hovertemplate: `Average score: ${binStartValue} - ${binEndValueDisplay}<br>%{y:,} ${surveyCountText}`,
        showlegend: false,
      }
    })
    .filter((trace) => trace.x && trace.x.length > 0)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Complexity score',
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
          <ChartSubtitle>
            {`${pluralizeWordWithCount(habitatComplexityValues.length ?? 0, 'Survey')}`}
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
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
