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
  const hasGroupDensityData = groupDensity && Object.keys(groupDensity).length > 0
  const macroinvertebrateGroupLabels = Object.keys(groupDensity)
  const formattedMacroinvertebrateGroupLabels = macroinvertebrateGroupLabels.map((label) =>
    label.replace(' ', '<br>'),
  )

  const plotlyDataConfiguration = [
    {
      x: macroinvertebrateGroupLabels,
      y: Object.values(groupDensity),
      type: 'bar',
      marker: {
        color: Object.values(chartTheme.macroinvertebrate.groupColors),
        line: { color: 'black', width: 1 },
      },
      xbins: {
        size: 100,
      },
      hovertemplate: '%{x}<br>%{y:,.0f} ind/ha<extra></extra>',
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 70, b: 80 },
    xaxis: {
      ...chartTheme.layout.xaxis,
      tickangle: -45,
      tickfont: { size: 9 },
      tickmode: 'array',
      tickvals: macroinvertebrateGroupLabels,
      ticktext: formattedMacroinvertebrateGroupLabels,
      title: {
        ...chartTheme.layout.xaxis.title,
        text: t('macroinvertebrate.group_of_interest_axis'),
      },
    },
    yaxis: {
      ...chartTheme.layout.yaxis,
      title: {
        ...chartTheme.layout.yaxis.title,
        text: `${t('macroinvertebrate.density_axis')}`,
      },
    },
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
    density_indha_group_interest_avg: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
}
