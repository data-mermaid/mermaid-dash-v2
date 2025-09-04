import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'

import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'
import { checkXSeriesYears } from '../../../helperFunctions/chartHelpers'

const categories = Object.keys(plotlyChartTheme.chartCategoryType.benthicCoverColorMap)

const benthicCoverApiKey = {
  hard_coral: 'Hard coral',
  bare_substrate: 'Bare substrate',
  crustose_coralline_algae: 'Crustose coralline algae',
  rubble: 'Rubble',
  cyanobacteria: 'Cyanobacteria',
  seagrass: 'Seagrass',
  sand: 'Sand',
  macroalgae: 'Macroalgae',
  turf_algae: 'Turf algae',
  soft_coral: 'Soft coral',
  other_invertebrates: 'Other invertebrates',
}

const isValidNumber = (num) => {
  return typeof num === 'number' && !Number.isNaN(num)
}

const getBenthicProtocolData = (protocols) => {
  return (
    protocols?.benthicpit?.percent_cover_benthic_category_avg ||
    protocols?.benthiclit?.percent_cover_benthic_category_avg ||
    protocols?.benthicpqt?.percent_cover_benthic_category_avg
  )
}

const calculateCategoryAverages = (protocols, categories) => {
  const benthicCategories = {}

  categories.forEach((category) => {
    const categoryName = benthicCoverApiKey[category]
    const avgValues = Object.keys(protocols)
      .map((protocol) => {
        const categoryData = protocols[protocol]?.percent_cover_benthic_category_avg
        return categoryData?.[categoryName] ?? null
      })
      .filter((val) => val !== null)

    benthicCategories[categoryName] =
      avgValues.length > 0 ? avgValues.reduce((sum, val) => sum + val, 0) / avgValues.length : null
  })

  return benthicCategories
}

const initializeYearData = (year, categories) => ({
  year,
  ...Object.fromEntries(categories.map((category) => [benthicCoverApiKey[category], 0])),
  count: 0,
})

const normalizePercentages = (yearData, categories) => {
  let total = 0

  categories.forEach((category) => {
    const categoryName = benthicCoverApiKey[category]
    yearData[categoryName] /= yearData.count
    total += yearData[categoryName]
  })

  if (total > 0) {
    categories.forEach((category) => {
      const categoryName = benthicCoverApiKey[category]
      yearData[categoryName] = (yearData[categoryName] / total) * 100
    })
  }

  return yearData
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
      const hasBenthicData = getBenthicProtocolData(recordProtocols) ? 1 : 0

      const benthicCategories = calculateCategoryAverages(recordProtocols, categories)

      if (!accumulator[year]) {
        accumulator[year] = initializeYearData(year, categories)
      }

      accumulator[year].count += hasBenthicData

      categories.forEach((category) => {
        const categoryName = benthicCoverApiKey[category]
        if (benthicCategories[categoryName] !== null) {
          accumulator[year][categoryName] += benthicCategories[categoryName]
        }
      })

      return accumulator
    },
    {},
  )

  const benthicPercentageCoverDistributions = Object.values(groupedBenthicCategoryCountByYear).map(
    (yearData) => normalizePercentages(yearData, categories),
  )

  const totalSurveys = benthicPercentageCoverDistributions
    .filter((record) => isValidNumber(record['Hard coral']))
    .reduce((sum, { count }) => sum + count, 0)

  const plotlyDataConfiguration = categories
    .map((category) => {
      const categoryName = benthicCoverApiKey[category]
      const validDistributions = benthicPercentageCoverDistributions.filter((distribution) =>
        isValidNumber(distribution[categoryName]),
      )

      return {
        x: validDistributions.map((distribution) => distribution.year),
        y: validDistributions.map((distribution) => distribution[categoryName]),
        type: 'bar',
        name: categoryName,
        marker: {
          color: plotlyChartTheme.chartCategoryType.benthicCoverColorMap[category],
        },
        hovertemplate: `${categoryName}<br>Year: %{x}<br>%{y:.1f}% cover<extra></extra>`,
      }
    })
    .filter((trace) => trace.y.some((value) => value > 0))

  const allSeriesHaveFewerThanThreeYears = checkXSeriesYears(plotlyDataConfiguration)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    barmode: 'stack',
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Year',
      },
      type: allSeriesHaveFewerThanThreeYears ? 'category' : 'linear',
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: 'Benthic cover (%)' },
    },
    showlegend: true,
    legend: {
      ...plotlyChartTheme.horizontalLegend,
      title: {
        text: 'Benthic category:',
        side: 'top',
        font: {
          size: 12,
        },
      },
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Benthic % Cover</MetricCardH3>
        {!privateBenthicToggleOn && (
          <ChartSubtitle>{`${pluralizeWordWithCount(totalSurveys ?? 0, 'Survey')}`}</ChartSubtitle>
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
