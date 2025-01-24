import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart
// Data processing
const categories = [
  'Hard coral',
  'Bare substrate',
  'Crustose coralline algae',
  'Rubble',
  'Cyanobacteria',
  'Seagrass',
  'Sand',
  'Macroalgae',
  'Turf algae',
  'Soft coral',
  'Other invertebrates',
]

export const TimeSeriesBenthicCover = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)

  const yearlyData = filteredSurveys.reduce((acc, event) => {
    const year = new Date(event.sample_date).getFullYear()
    const protocols = event.protocols || {}
    const benthicCategories = {}

    categories.forEach((category) => {
      const values = Object.keys(protocols).map((protocol) => {
        const categoryData = protocols[protocol]?.percent_cover_benthic_category_avg
        return categoryData?.[category] ?? null
      })

      const validValues = values.filter((val) => val !== null)
      benthicCategories[category] =
        validValues.length > 0
          ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
          : null
    })

    if (!acc[year]) {
      acc[year] = { year, ...Object.fromEntries(categories.map((cat) => [cat, 0])), count: 0 }
    }

    acc[year].count += 1
    categories.forEach((category) => {
      if (benthicCategories[category] !== null) {
        acc[year][category] += benthicCategories[category]
      }
    })

    return acc
  }, {})

  const processedData = Object.values(yearlyData).map((yearData) => {
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
  })

  const plotlyDataConfiguration = categories.map((category, index) => ({
    x: processedData.map((data) => data.year),
    y: processedData.map((data) => data[category]),
    type: 'bar',
    name: category,
    marker: {
      color: chartTheme.timeseriesCharts.benthicCoverColor[index],
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
