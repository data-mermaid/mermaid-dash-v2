import Plot from 'react-plotly.js'

import { ChartSubtitle, ChartWrapper, TitlesWrapper } from './Charts.styles'
import { MetricCardH3 } from '../MetricsPane.styles'
import lowHabIcon from '../../../assets/low-hb-icon.png'
import mediumHabIcon from '../../../assets/medium-hb-icon.png'
import highHabIcon from '../../../assets/high-hb-icon.png'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'
import { PrivateChartView } from './PrivateChartView'

const chartTheme = dashboardOnlyTheme.plotlyChart

export const SampleEventHabitatComplexityPlot = ({ habitatComplexityData }) => {
  const totalSurveys = habitatComplexityData?.sample_unit_count ?? 0
  const habitatComplexityScore = habitatComplexityData?.score_avg_avg

  const plotlyDataConfiguration = [
    { x: [0, 5], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'black', width: 4 } },
    ...[0, 1, 2, 3, 4, 5].map((x) => ({
      x: [x, x],
      y: [-0.05, 0.05],
      type: 'scatter',
      mode: 'lines',
      line: { color: 'black', width: 4 },
    })),
    {
      x: [habitatComplexityScore, habitatComplexityScore],
      y: [0, 0.8],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#70aae6', width: 4 },
    },
    {
      x: [habitatComplexityScore],
      y: [0],
      type: 'scatter',
      mode: 'markers',
      marker: { color: '#70aae6', size: 20 },
    },
  ]

  const plotlyLayoutConfiguration = {
    ...chartTheme.layout,
    margin: { ...chartTheme.layout.margin, t: 0, b: 40 },
    xaxis: {
      title: '',
      range: [-0.5, 5.5],
      zeroline: false,
      showline: false,
      showticklabels: true,
      tickvals: [0, 1, 2, 3, 4, 5],
      showgrid: false,
    },
    yaxis: {
      title: '',
      range: [-0.1, 1.5],
      zeroline: false,
      showline: false,
      showticklabels: false,
      showgrid: false,
    },
    images: [
      {
        source: lowHabIcon,
        x: -0.5,
        y: 0.1,
        sizex: 1,
        sizey: 1,
        xref: 'x',
        yref: 'y',
        layer: 'below',
        xanchor: 'left',
        yanchor: 'bottom',
      },
      {
        source: mediumHabIcon,
        x: 2,
        y: 0.1,
        sizex: 1,
        sizey: 1,
        xref: 'x',
        yref: 'y',
        layer: 'below',
        xanchor: 'left',
        yanchor: 'bottom',
      },
      {
        source: highHabIcon,
        x: 4.5,
        y: 0.1,
        sizex: 1,
        sizey: 1,
        xref: 'x',
        yref: 'y',
        layer: 'below',
        xanchor: 'left',
        yanchor: 'bottom',
      },
    ],
    annotations: [
      {
        x: habitatComplexityScore,
        y: 0.9,
        text: habitatComplexityScore
          ? `${habitatComplexityScore} <br> Average Habitat <br> Complexity`
          : `No Scores <br> Available`,
        showarrow: false,
        xref: 'x',
        yref: 'y',
        xanchor: 'middle',
        yanchor: 'middle',
        bordercolor: '#70aae6',
        bgcolor: 'white',
        borderwidth: 3,
        borderpad: 3,
        font: { size: 12 },
      },
    ],
    showlegend: false,
  }

  return (
    <ChartWrapper>
      <TitlesWrapper>
        <MetricCardH3>Habitat Complexity</MetricCardH3>
        {habitatComplexityScore && (
          <ChartSubtitle>{totalSurveys.toLocaleString()} Surveys</ChartSubtitle>
        )}
      </TitlesWrapper>
      {habitatComplexityScore ? (
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
