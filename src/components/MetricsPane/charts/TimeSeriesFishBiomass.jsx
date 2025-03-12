import { useContext } from 'react'
import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'

function calculateMedian(values) {
  if (!values.length) {
    return null
  }

  const sorted = values.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const TimeSeriesFishBiomass = () => {
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const medianFishBiomassDistributions = []
  const privateFishBeltToggleOn =
    !omittedMethodDataSharingFilters.includes('bf_3') &&
    omittedMethodDataSharingFilters.includes('bf_2') &&
    omittedMethodDataSharingFilters.includes('bf_1')

  const surveyedFishBiomassRecords = filteredSurveys
    .filter(
      (record) =>
        record.protocols?.beltfish?.biomass_kgha_avg !== undefined &&
        record.protocols?.beltfish?.biomass_kgha_avg !== null,
    )
    .map((record) => ({
      sampleDate: record.sample_date,
      avgBiomass: record.protocols.beltfish.biomass_kgha_avg,
      managementRule: record.management_rules.includes('open access')
        ? 'Open Access'
        : 'Restrictions',
    }))

  const groupedFishBiomassByYearManagement = surveyedFishBiomassRecords.reduce(
    (accumulator, record) => {
      const { managementRule, avgBiomass, sampleDate } = record
      const year = new Date(sampleDate).getFullYear()

      if (!accumulator[year]) {
        accumulator[year] = {}
      }

      if (!accumulator[year][managementRule]) {
        accumulator[year][managementRule] = []
      }

      accumulator[year][managementRule].push(avgBiomass)

      return accumulator
    },
    {},
  )

  Object.entries(groupedFishBiomassByYearManagement).forEach(([year, managementRuleGroup]) => {
    Object.entries(managementRuleGroup).forEach(([managementRule, biomassValues]) => {
      medianFishBiomassDistributions.push({
        year: Number(year),
        managementRule,
        medianFishBiomass: calculateMedian(biomassValues),
      })
    })
  })

  const uniqueManagementRules = [
    ...new Set(medianFishBiomassDistributions.map((d) => d.managementRule)),
  ]

  const plotlyDataConfiguration = uniqueManagementRules.map((rule) => ({
    x: medianFishBiomassDistributions
      .filter((distribution) => distribution.managementRule === rule)
      .map((distribution) => distribution.year),
    y: medianFishBiomassDistributions
      .filter((distribution) => distribution.managementRule === rule)
      .map((distribution) => distribution.medianFishBiomass),
    type: 'bar',
    name: rule,
    marker: { color: plotlyChartTheme.chartCategoryType.managementRuleColorMap[rule] },
    hovertemplate: '%{x}, %{y:.2f}',
  }))

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: 'Year',
      },
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: { ...plotlyChartTheme.layout.yaxis.title, text: '(kg/ha)' },
    },
    showlegend: true,
    legend: plotlyChartTheme.horizontalLegend,
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Fish Biomass (KG/HA) </MetricCardH3>
        {!privateFishBeltToggleOn && (
          <ChartSubtitle>
            {surveyedFishBiomassRecords.length.toLocaleString()} Surveys
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      {privateFishBeltToggleOn ? (
        <PrivateChartView />
      ) : surveyedFishBiomassRecords.length > 0 ? (
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
