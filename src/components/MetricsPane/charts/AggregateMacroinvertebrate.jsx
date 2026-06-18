import { useContext } from 'react'
import Plot from 'react-plotly.js'
import { useTranslation } from 'react-i18next'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWord, pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

const BIN_SIZE = 250
const START_BIN = 0
const END_BIN = 3000
export const AggregateMacroinvertebrate = () => {
  const { t } = useTranslation()
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateMacroinvertebrateToggleOn = omittedMethodDataSharingFilters.includes('mi_all')

  // An array of the avg density values across surveys.
  const macroinvertebrateDensityValues = filteredSurveys
    .map((record) => record.protocols?.macroinvertebrate?.density_indha_avg)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  const binStartValues = Array.from(
    { length: (END_BIN - START_BIN) / BIN_SIZE },
    (_, index) => START_BIN + index * BIN_SIZE,
  )

  const valuesWithinDefaultRange = macroinvertebrateDensityValues.filter(
    (value) => value <= END_BIN,
  )
  const valuesAboveDefaultRange = macroinvertebrateDensityValues
    .filter((value) => value >= END_BIN)
    .map(() => END_BIN)
  const hasValuesAboveDefaultRange = valuesAboveDefaultRange.length > 0

  const histogramDataConfiguration = binStartValues
    .map((binStartValue) => {
      const binEndValue = binStartValue + BIN_SIZE
      const binEndValueDisplay = binEndValue - 1
      const xValues = valuesWithinDefaultRange.filter(
        (value) => value >= binStartValue && value < binEndValue,
      )

      return {
        x: xValues,
        type: 'histogram',
        name: '',
        marker: {
          color: plotlyChartTheme.aggregateCharts.default.marker.color,
        },
        xbins: { start: binStartValue, end: binEndValue, size: BIN_SIZE },
        hovertemplate: `${t('macroinvertebrate.bin')}: ${binStartValue} - ${binEndValueDisplay} ind/ha<br>%{y:,} ${pluralizeWord(xValues.length, 'survey')}<extra></extra>`,
        showlegend: false,
      }
    })
    .concat({
      x: valuesAboveDefaultRange,
      type: 'histogram',
      name: '',
      marker: {
        color: plotlyChartTheme.aggregateCharts.default.marker.color,
      },
      xbins: { start: END_BIN, end: END_BIN + BIN_SIZE, size: BIN_SIZE },
      hovertemplate: `${t('macroinvertebrate.bin')}: ${END_BIN}+ ind/ha<br>%{y:,} ${pluralizeWord(valuesAboveDefaultRange.length, 'survey')}<extra></extra>`,
      showlegend: false,
    })
    .filter((trace) => trace.x.length > 0)

  const histogramLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: t('macroinvertebrate.density_axis'),
      },
      tickmode: hasValuesAboveDefaultRange ? 'array' : 'auto',
      tickvals: hasValuesAboveDefaultRange ? [0, 500, 1000, 1500, 2000, 2500, 3000] : undefined,
      ticktext: hasValuesAboveDefaultRange
        ? ['0', '500', '1000', '1500', '2000', '2500', '3000+']
        : undefined,
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: {
        ...plotlyChartTheme.layout.yaxis.title,
        text: t('macroinvertebrate.surveys_axis'),
      },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>{t('macroinvertebrate.title')}</MetricCardH3>
        {!privateMacroinvertebrateToggleOn && (
          <ChartSubtitle>
            {`${pluralizeWordWithCount(macroinvertebrateDensityValues.length, 'Survey')}`}
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateMacroinvertebrateToggleOn ? (
        <PrivateChartView />
      ) : macroinvertebrateDensityValues.length > 0 ? (
        <Plot
          data={histogramDataConfiguration}
          layout={histogramLayoutConfiguration}
          config={plotlyChartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <NoDataChartView />
      )}
    </ChartWrapper>
  )
}
