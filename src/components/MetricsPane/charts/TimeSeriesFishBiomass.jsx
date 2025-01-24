import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

const chartTheme = dashboardOnlyTheme.plotlyChart

function calculateMedian(values) {
  if (!values.length) return null
  const sorted = values.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const TimeSeriesFishBiomass = () => {
  const { filteredSurveys } = useContext(FilterProjectsContext)
  const fishMedianBiomassGroupByYearManagement = []

  const validFilteredSurveys = filteredSurveys
    .filter(
      (item) =>
        item.protocols.beltfish?.biomass_kgha_avg !== undefined &&
        item.protocols.beltfish?.biomass_kgha_avg !== null,
    )
    .map((item) => ({
      sampleDate: item.sample_date,
      avgBiomass: item.protocols.beltfish.biomass_kgha_avg,
      managementRules: item.management_rules.includes('open access')
        ? 'Open Access'
        : 'Restrictions',
    }))

  const fishBiomassGroupByYearManagement = validFilteredSurveys.reduce((acc, item) => {
    const year =
      new Date(item.sampleDate).getFullYear() < 1900
        ? 2024
        : new Date(item.sampleDate).getFullYear()

    if (!acc[year]) acc[year] = {}
    if (!acc[year][item.managementRules]) {
      acc[year][item.managementRules] = []
    }

    acc[year][item.managementRules].push(item.avgBiomass)
    return acc
  }, {})

  Object.entries(fishBiomassGroupByYearManagement).forEach(([year, managementRuleGroup]) => {
    Object.entries(managementRuleGroup).forEach(([managementRules, biomassValues]) => {
      fishMedianBiomassGroupByYearManagement.push({
        year: parseInt(year, 10),
        managementRules,
        medianFishBiomass: calculateMedian(biomassValues),
      })
    })
  })

  const plotlyDataConfiguration = Object.entries(
    fishMedianBiomassGroupByYearManagement.reduce((acc, item) => {
      if (!acc[item.managementRules]) {
        acc[item.managementRules] = {
          x: [],
          y: [],
          type: 'bar',
          name: item.managementRules,
          marker: {
            color: chartTheme.timeseriesCharts.managementRulesColorMap[item.managementRules],
          },
        }
      }

      acc[item.managementRules].x.push(item.year)
      acc[item.managementRules].y.push(item.medianFishBiomass)
      return acc
    }, {}),
  ).map(([_, values]) => values)

  const removeFractionalXAxisLabelForOneGroup =
    fishMedianBiomassGroupByYearManagement.length === 1
      ? {
          tickmode: 'linear',
          dtick: 1,
        }
      : {}

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    xaxis: {
      ...chartTheme.layout.xaxis,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: 'Year',
      },
      ...removeFractionalXAxisLabelForOneGroup,
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: { ...chartTheme.layout.yaxis.title, text: '(kg/ha)' },
    },
    legend: {
      orientation: 'h',
      xanchor: 'center',
      x: 0.5,
      y: -0.2,
    },
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass (KG/HA) </MetricCardH3>
        <ChartSubtitle>{validFilteredSurveys.length.toLocaleString()} Surveys</ChartSubtitle>
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
