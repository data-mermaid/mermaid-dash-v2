import { useContext } from 'react'
import Plot from 'react-plotly.js'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import theme from '../../../styles/theme'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { NoDataChartView } from './NoDataChartView'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

const FullWidthDiv = styled.div`
  width: 100%;
  background: ${theme.color.white};
  border: ${theme.spacing.borderSmall} solid ${theme.color.border};
`

export const MacroinvertebrateDensityByGroup = () => {
  const { t } = useTranslation()
  const { filteredSurveys, omittedMethodDataSharingFilters } = useContext(FilterProjectsContext)
  const privateMacroinvertebrateToggleOn =
    !omittedMethodDataSharingFilters.includes('mi_3') &&
    omittedMethodDataSharingFilters.includes('mi_2') &&
    omittedMethodDataSharingFilters.includes('mi_1')

  const surveyDensityValues = filteredSurveys
    .map((record) => record.protocols?.macroinvertebrate?.density_indha_group_interest_avg)
    .filter((groupDensity) => groupDensity && typeof groupDensity === 'object')

  const densityStatsByGroup = surveyDensityValues.reduce((accumulator, groupDensity) => {
    Object.entries(groupDensity).forEach(([groupName, density]) => {
      if (density === undefined || density === null || Number.isNaN(Number(density))) {
        return
      }

      if (!accumulator[groupName]) {
        accumulator[groupName] = { totalDensity: 0, sampleCount: 0 }
      }

      accumulator[groupName].totalDensity += Number(density)
      accumulator[groupName].sampleCount += 1
    })

    return accumulator
  }, {})

  const averageDensitiesByGroupSorted = Object.entries(densityStatsByGroup)
    .map(([groupName, summary]) => ({
      groupName,
      avgDensity: summary.totalDensity / summary.sampleCount,
    }))
    .sort((a, b) => b.avgDensity - a.avgDensity)

  const groupColors = plotlyChartTheme.macroinvertebrate.groupColors
  const groupColorCount = groupColors.length

  const groupOfInterestDataConfiguration = [
    {
      x: averageDensitiesByGroupSorted.map((group) => group.groupName),
      y: averageDensitiesByGroupSorted.map((group) => group.avgDensity),
      type: 'bar',
      marker: {
        color: averageDensitiesByGroupSorted.map(
          (_, index) => groupColors[index % groupColorCount],
        ),
      },
      hovertemplate: `${t('macroinvertebrate.group_of_interest_axis')}: %{x}<br>${t('macroinvertebrate.density_axis')}: %{y:,.1f}<extra></extra>`,
      showlegend: false,
    },
  ]

  const groupOfInterestLayoutConfiguration = {
    ...plotlyChartTheme.layout,
    margin: { ...plotlyChartTheme.layout.margin, b: 110 },
    xaxis: {
      ...plotlyChartTheme.layout.xaxis,
      title: {
        ...plotlyChartTheme.layout.xaxis.title,
        text: t('macroinvertebrate.group_of_interest_axis'),
      },
      tickangle: -30,
      type: 'category',
    },
    yaxis: {
      ...plotlyChartTheme.layout.yaxis,
      title: {
        ...plotlyChartTheme.layout.yaxis.title,
        text: t('macroinvertebrate.density_axis'),
      },
    },
  }

  return (
    <FullWidthDiv>
      <ChartWrapper>
        <TitlesWrapper>
          <MetricCardH3>{t('macroinvertebrate.title')}</MetricCardH3>
          {!privateMacroinvertebrateToggleOn && (
            <ChartSubtitle>
              {`${pluralizeWordWithCount(
                averageDensitiesByGroupSorted.length,
                'Group of interest',
                'Groups of interest',
              )}`}
            </ChartSubtitle>
          )}
        </TitlesWrapper>
        <HorizontalLine />
        {privateMacroinvertebrateToggleOn ? (
          <PrivateChartView />
        ) : averageDensitiesByGroupSorted.length > 0 ? (
          <Plot
            data={groupOfInterestDataConfiguration}
            layout={groupOfInterestLayoutConfiguration}
            config={plotlyChartTheme.config}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <NoDataChartView />
        )}
      </ChartWrapper>
    </FullWidthDiv>
  )
}
