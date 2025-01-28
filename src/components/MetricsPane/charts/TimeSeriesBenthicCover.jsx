import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
const categories = Object.keys(chartTheme.timeseriesCharts.benthicCoverColorMap)

export const TimeSeriesBenthicCover = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const groupedBenthicCategoryCountByYear = filteredSurveys.reduce(
    (accumulator, { sample_date, protocols }) => {
      const year = new Date(sample_date).getFullYear()
      const recordProtocols = protocols || {}
      const benthicCategories = {}

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

      accumulator[year].count += 1
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

  const plotlyDataConfiguration = categories.map((category) => ({
    x: benthicPercentageCoverDistributions.map((distribution) => distribution.year),
    y: benthicPercentageCoverDistributions.map((distribution) => distribution[category]),
    type: 'bar',
    name: category,
    marker: {
      color: chartTheme.timeseriesCharts.benthicCoverColorMap[category],
    },
  }))

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    barmode: 'stack',
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Year',
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: 'Benthic % Cover' },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Benthic % Cover</MetricCardH3>
        <ChartSubtitle>{filteredSurveys.length.toLocaleString()} Surveys</ChartSubtitle>
      </TitlesWrapper>

      <Plot
        data={plotlyDataConfiguration}
        layout={plotlyLayoutConfiguration}
        config={chartTheme.config}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartWrapper>
  )
}
