import { useContext } from 'react'
import Plot from 'react-plotly.js'
import { useTranslation } from 'react-i18next'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'
import { checkXSeriesYears } from '../../../helperFunctions/chartHelpers'

export const TimeSeriesMacroinvertebrate = () => {
  const { t } = useTranslation()
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateMacroinvertebrateToggleOn =
    !omittedMethodDataSharingFilters.includes('mi_3') &&
    omittedMethodDataSharingFilters.includes('mi_2') &&
    omittedMethodDataSharingFilters.includes('mi_1')

  const surveyedMacroinvertebrateRecords = filteredSurveys
    .filter(
      (record) =>
        record.protocols?.macroinvertebrate?.density_indha_avg !== undefined &&
        record.protocols?.macroinvertebrate?.density_indha_avg !== null,
    )
    .map((record) => ({
      sampleDate: record.sample_date,
      avgDensity: Number(record.protocols.macroinvertebrate.density_indha_avg),
      managementRule: (record.management_rules || []).includes('open access')
        ? 'Open Access'
        : 'Restrictions',
    }))

  /*
    {
      year: {
        "Open Access": [densityValue1, densityValue2, ...],
        "Restrictions": [densityValue1, densityValue2, ...],
      }
    }[]
  */
  const groupedMacroinvertebrateDensityByYearManagement = surveyedMacroinvertebrateRecords.reduce(
    (accumulator, record) => {
      const { managementRule, avgDensity, sampleDate } = record
      const year = new Date(sampleDate).getFullYear()

      if (!accumulator[year]) {
        accumulator[year] = {}
      }

      if (!accumulator[year][managementRule]) {
        accumulator[year][managementRule] = []
      }

      accumulator[year][managementRule].push(avgDensity)
      return accumulator
    },
    {},
  )

  const meanMacroinvertebrateDensityDistributions = []

  Object.entries(groupedMacroinvertebrateDensityByYearManagement).forEach(
    ([year, managementRuleGroup]) => {
      Object.entries(managementRuleGroup).forEach(([managementRule, densityValues]) => {
        const totalDensity = densityValues.reduce((sum, value) => sum + value, 0)
        const meanDensity = densityValues.length > 0 ? totalDensity / densityValues.length : 0

        meanMacroinvertebrateDensityDistributions.push({
          year: Number(year),
          managementRule,
          meanDensity,
        })
      })
    },
  )

  const uniqueManagementRules = [
    ...new Set(
      meanMacroinvertebrateDensityDistributions.map((distribution) => distribution.managementRule),
    ),
  ]

  const plotlyDataConfiguration = uniqueManagementRules.map((rule) => ({
    x: meanMacroinvertebrateDensityDistributions
      .filter((distribution) => distribution.managementRule === rule)
      .map((distribution) => distribution.year),
    y: meanMacroinvertebrateDensityDistributions
      .filter((distribution) => distribution.managementRule === rule)
      .map((distribution) => distribution.meanDensity),
    type: 'bar',
    name: rule,
    marker: { color: plotlyChartTheme.chartCategoryType.managementRuleColorMap[rule] },
    hovertemplate: `${rule}<br>${t('macroinvertebrate.year_axis')}: %{x}<br>%{y:.0f} ind/ha<extra></extra>`,
  }))

  const allSeriesHaveFewerThanThreeYears = checkXSeriesYears(plotlyDataConfiguration)

  const plotlyLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: t('macroinvertebrate.year_axis'),
      },
      type: allSeriesHaveFewerThanThreeYears ? 'category' : 'linear',
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: {
        ...plotlyChartTheme.layout.yaxis.title,
        text: t('macroinvertebrate.density_axis'),
      },
    },
    showlegend: true,
    legend: {
      ...plotlyChartTheme.horizontalLegend,
      title: {
        text: `${t('macroinvertebrate.management_rule')}:`,
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
        <MetricCardH3>{t('macroinvertebrate.title')}</MetricCardH3>
        {!privateMacroinvertebrateToggleOn && (
          <ChartSubtitle>
            {`${pluralizeWordWithCount(surveyedMacroinvertebrateRecords.length ?? 0, 'Survey')}`}
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {privateMacroinvertebrateToggleOn ? (
        <PrivateChartView />
      ) : surveyedMacroinvertebrateRecords.length > 0 ? (
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
