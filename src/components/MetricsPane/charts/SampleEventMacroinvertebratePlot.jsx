import Plot from 'react-plotly.js'
import PropTypes from 'prop-types'

import { ChartSubtitle, ChartWrapper, HorizontalLine, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import plotlyChartTheme from '../../../styles/plotlyChartTheme'
import { PrivateChartView } from './PrivateChartView'
import { useTranslation } from 'react-i18next'

const chartTheme = plotlyChartTheme

export const SampleEventMacroinvertebratePlot = ({ macroinvertebrateData }) => {
  const { t } = useTranslation()
  const totalSampleUnits = macroinvertebrateData?.sample_unit_count ?? 0
  const groupDensity = macroinvertebrateData?.density_indha_group_interest_avg ?? {}
  const hasGroupDensityData = Object.keys(groupDensity).length > 0
  const sortedMacroinvertebrateGroups = Object.entries(groupDensity)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => {
      const isOtherA = a.label.toLowerCase() === 'other invertebrates'
      const isOtherB = b.label.toLowerCase() === 'other invertebrates'

      if (isOtherA && !isOtherB) {
        return 1
      }
      if (!isOtherA && isOtherB) {
        return -1
      }

      return b.value - a.value
    })
  const macroinvertebrateGroupLabels = sortedMacroinvertebrateGroups.map((group) => group.label)
  const macroinvertebrateGroupValues = sortedMacroinvertebrateGroups.map((group) => group.value)
  const macroinvertebrateGroupColors = macroinvertebrateGroupLabels.map(
    (_, index) =>
      chartTheme.macroinvertebrate.groupColors[
        index % chartTheme.macroinvertebrate.groupColors.length
      ],
  )
  const isDenseGroupChart = macroinvertebrateGroupLabels.length > 10
  const totalDensityValue =
    macroinvertebrateData?.density_indha_avg ??
    macroinvertebrateGroupValues.reduce((sum, value) => sum + (Number(value) || 0), 0)
  const formattedTotalDensityValue = Math.round(totalDensityValue).toLocaleString('en-US')

  const plotlyDataConfiguration = [
    {
      x: macroinvertebrateGroupLabels,
      y: macroinvertebrateGroupValues,
      type: 'bar',
      marker: {
        color: macroinvertebrateGroupColors,
        line: { color: 'black', width: 1 },
      },
      hovertemplate: '%{x}<br>%{y:,.0f} ind/ha<extra></extra>',
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: {
      ...chartTheme.layout.margin,
      t: 70,
      b: 80,
    },
    xaxis: {
      ...chartTheme.layout.xaxis,
      automargin: true,
      tickangle: isDenseGroupChart ? -60 : -45,
      tickfont: { size: isDenseGroupChart ? 8 : 9 },
      title: {
        ...chartTheme.layout.xaxis.title,
        text: t('macroinvertebrate.group_of_interest_axis'),
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      automargin: true,
      title: {
        ...chartTheme.layout.yaxis.title,
        text: `${t('macroinvertebrate.density_axis')}`,
      },
    },
    annotations: [
      {
        x: 1,
        y: 1.07,
        xref: 'paper',
        yref: 'paper',
        xanchor: 'right',
        yanchor: 'top',
        showarrow: false,
        text: `<b>${t('macroinvertebrate.total_density')}:</b> ${formattedTotalDensityValue} ind/ha`,
        font: { size: 12, color: '#404040' },
      },
    ],
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>{t('macroinvertebrate.title')}</MetricCardH3>
        {hasGroupDensityData && (
          <ChartSubtitle>
            {totalSampleUnits === 1
              ? t('sample_unit_one', { count: totalSampleUnits })
              : t('sample_unit_other', { count: totalSampleUnits })}
          </ChartSubtitle>
        )}
      </TitlesWrapper>
      <HorizontalLine />
      {hasGroupDensityData ? (
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

SampleEventMacroinvertebratePlot.propTypes = {
  macroinvertebrateData: PropTypes.shape({
    sample_unit_count: PropTypes.number,
    density_indha_avg: PropTypes.number,
    density_indha_group_interest_avg: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
}
