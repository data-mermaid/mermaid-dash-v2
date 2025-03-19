import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'

import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

const categories = Object.keys(plotlyChartTheme.chartCategoryType.benthicCoverColorMap)

const isValidNumber = (num) => {
  return typeof num === 'number' && !Number.isNaN(num)
}

export const TimeSeriesBenthicCover = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateBenthicFilters = ['bl_3', 'bp_3', 'qbp_3']
  const otherBenthicFilters = ['bl_1', 'bl_2', 'bp_1', 'bp_2', 'qbp_1', 'qbp_2']

  const privateBenthicToggleOn =
    privateBenthicFilters.some(
      (filterLabel) => !omittedMethodDataSharingFilters.includes(filterLabel),
    ) &&
    otherBenthicFilters.every((filterLabel) =>
      omittedMethodDataSharingFilters.includes(filterLabel),
    )

  const groupedBenthicCategoryCountByYear = filteredSurveys.reduce(
    (accumulator, { sample_date, protocols }) => {
      const year = new Date(sample_date).getFullYear()
      const recordProtocols = protocols || {}
      const benthicCategories = {}
      const surveyedBenthicCount =
        recordProtocols?.benthicpit?.percent_cover_benthic_category_avg ||
        recordProtocols?.benthiclit?.percent_cover_benthic_category_avg ||
        recordProtocols?.benthicpqt?.percent_cover_benthic_category_avg
          ? 1
          : 0

      categories.forEach((category) => {
        const avgBenthicCoverValues = Object.keys(recordProtocols)
          .map((protocol) => {
            const categoryData = recordProtocols[protocol]?.percent_cover_benthic_category_avg
            return categoryData?.[category] ?? null
          })
          .filter((val) => val !== null)

        benthicCategories[category] =
          avgBenthicCoverValues.length > 0
            ? avgBenthicCoverValues.reduce((sum, val) => sum + val, 0) /
              avgBenthicCoverValues.length
            : null
      })

      if (!accumulator[year]) {
        accumulator[year] = {
          year,
          ...Object.fromEntries(categories.map((category) => [category, 0])),
          count: 0,
        }
      }

      accumulator[year].count += surveyedBenthicCount
      categories.forEach((category) => {
        if (benthicCategories[category] !== null) {
          accumulator[year][category] += benthicCategories[category]
        }
      })

      return accumulator
    },
    {},
  )

  const benthicPercentageCoverDistributions = Object.values(groupedBenthicCategoryCountByYear).map(
    (yearData) => {
      let total = 0

      categories.forEach((category) => {
        yearData[category] /= yearData.count
        total += yearData[category]
      })

      if (total > 0) {
        categories.forEach((category) => {
          yearData[category] = (yearData[category] / total) * 100
        })
      }

      return yearData
    },
  )
  const totalSurveys = benthicPercentageCoverDistributions
    .filter((record) => isValidNumber(record['Hard coral']))
    .reduce((sum, { count }) => sum + count, 0)

  const plotlyDataConfiguration = categories
    .map((category) => {
      const validDistributions = benthicPercentageCoverDistributions.filter((distribution) =>
        isValidNumber(distribution[category]),
      )

      return {
        x: validDistributions.map((distribution) => distribution.year),
        y: validDistributions.map((distribution) => distribution[category]),
        type: 'bar',
        name: category,
        marker: {
          color: plotlyChartTheme.chartCategoryType.benthicCoverColorMap[category],
        },
        hovertemplate: `<b>${category}</b><br>%{x}<br>%{y:.1f}%<extra></extra>`,
      }
    })
    .filter((trace) => trace.y.some((value) => value > 0))

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    barmode: 'stack',
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Year',
      },
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: 'Benthic cover (%)' },
    },
    showlegend: true,
    legend: plotlyChartTheme.horizontalLegend,
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Benthic % Cover</MetricCardH3>
        {!privateBenthicToggleOn && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateBenthicToggleOn ? (
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
