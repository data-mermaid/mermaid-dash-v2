const plotlyChartTheme = {
  aggregateCharts: {
    default: { marker: { color: '#769fca' } },
    hardCoralCover: { marker: { low: '#d13823', medium: '#f3a224', high: '#277d1d' } },
    bleaching: {
      marker: {
        color: ['#3c6e9a', '#6288ad', '#85a3c1', '#a8bed5', '#cbdaea', '#eff7ff', '#b4b4b4'],
      },
    },
  },
  //The below text strings come from the API and
  //may break multiple areas when updated to tokens
  chartCategoryType: {
    managementRuleColorMap: {
      'Open Access': '#e69f00',
      Restrictions: '#70aae6',
    },
    benthicCoverColorMap: {
      'Hard coral': '#498fc9',
      'Bare substrate': '#f2f3f3',
      'Crustose coralline algae': '#fbd7d5',
      Rubble: '#f5f6af',
      Cyanobacteria: '#870e00',
      Seagrass: '#4d4d4d',
      Sand: '#c1b180',
      Macroalgae: '#b2b000',
      'Turf algae': '#d9eea8',
      'Soft coral': '#9ce5fa',
      'Other invertebrates': '#4e4e4e',
    },
    habitatComplexityColorMap: {
      0: '#eff7ff',
      1: '#cbdaea',
      2: '#a8bed5',
      3: '#85a3c1',
      4: '#6288ad',
      5: '#3c6e9a',
    },
    bleachingColorMap: {
      Normal: '#3c6e9a',
      Pale: '#6288ad',
      '0-20%': '#85a3c1',
      '20-50%': '#a8bed5',
      '50-80%': '#cbdaea',
      '80-100%': '#eff7ff',
      Dead: '#b4b4b4',
    },
    fishTropicGroupColorMap: {
      omnivore: '#80cdc1',
      piscivore: '#377eb8',
      planktivore: '#bebada',
      invertivore_mobile: '#fcae61',
      invertivore_sessile: '#fdd92f',
      herbivore_macroalgae: '#4d9221',
      herbivore_detritivore: '#d9ed8b',
    },
    bleachingBenthicColorMap: {
      hard_coral: '#498fc9',
      soft_coral: '#9ce5fa',
      macroalgae: '#b6b400',
      other: '#b4b4b4',
    },
  },
  layout: {
    bargap: 0.1,
    dragmode: false,
    height: 400,
    autosize: true,
    margin: {
      l: 50,
      r: 30,
      b: 40,
      t: 70,
    },
    xaxis: {
      fixedrange: true,
      linecolor: 'black',
      linewidth: 2,
      title: { standoff: 5 },
    },
    yaxis: {
      fixedrange: true,
      linecolor: 'black',
      linewidth: 2,
      title: { standoff: 5 },
    },
    modebar: {
      orientation: 'v',
    },
  },
  config: {
    modeBarButtonsToRemove: [
      'zoom2d',
      'pan2d',
      'select2d',
      'lasso2d',
      'zoomIn2d',
      'zoomOut2d',
      'autoScale2d',
      'resetScale2d',
    ],
    displaylogo: false,
    responsive: true,
    displayModeBar: true,
  },
  horizontalLegend: {
    orientation: 'h',
    xanchor: 'center',
    x: 0.4,
    y: -0.25,
    font: {
      size: 9,
    },
  },
}

export default plotlyChartTheme
