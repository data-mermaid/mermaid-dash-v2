import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = plotlyChartTheme
const benthicCategories = Object.entries(chartTheme.chartCategoryType.benthicCoverColorMap)

export const SampleEventBenthicPlot = ({ benthicType, benthicData }) => {
  const totalSurveys = benthicData?.sample_unit_count ?? 0
  const benthicPercentageData = benthicData?.percent_cover_benthic_category_avg

  const benthicPercentageCover = benthicCategories.map(([category, color]) => {
    const categoryValue = benthicPercentageData?.[category] ?? 0
    return {
      name: category,
      value: categoryValue,
      color: color,
    }
  })

  const plotlyDataConfiguration = benthicPercentageCover
    .filter(({ value }) => value > 0)
    .map(({ name, value, color }) => {
      return {
        x: [1],
        y: [value / 100],
        type: 'bar',
        name: `${name} (${value}%)`,
        marker: {
          color: color,
        },
      }
    })

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 70, b: 20 },
    barmode: 'stack',
    bargap: 0,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: '',
      showticklabels: false,
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: '',
      range: [0, 1],
      tickvals: Array.from({ length: 11 }, (_, i) => i / 10),
      tickformat: '.0%',
    },
    showlegend: true,
    legend: {
      font: { size: 10 },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Benthic % Cover ({benthicType})</MetricCardH3>
        {benthicPercentageData && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
      {benthicPercentageData ? (
        <Plot
          data={plotlyDataConfiguration}
          layout={plotlyLayoutConfiguration}
          config={chartTheme.config}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <PrivateChartView />
      )}
    </ChartWrapper>
  )
}

SampleEventBenthicPlot.propTypes = {
  benthicType: PropTypes.string.isRequired,
  benthicData: PropTypes.shape({
    sample_unit_count: PropTypes.number,
    percent_cover_benthic_category_avg: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
}
