import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import { ChartTabsWrapper, Tab, TabList, TabPanel } from './MetricsPaneChartTabs.styles'
import { URL_PARAMS } from '../../constants/constants'

const { BENTHIC_COVER, FISH_BIOMASS, BLEACHING, HABITAT_COMPLEXITY } = URL_PARAMS

const TAB_IDS = {
  AGGREGATE: 'aggregate',
  TIME_SERIES: 'timeSeries',
}

const getChartParamTypeByChartId = {
  'hard-coral-cover': BENTHIC_COVER,
  'fish-biomass': FISH_BIOMASS,
  bleaching: BLEACHING,
  'habitat-complexity': HABITAT_COMPLEXITY,
}

const useTabSelection = (chartQueryParam) => {
  const { getURLParams, updateURLParams } = useContext(FilterProjectsContext)
  const queryParams = getURLParams()
  const [selectedTab, setSelectedTab] = useState(
    queryParams.has(chartQueryParam) ? TAB_IDS.TIME_SERIES : TAB_IDS.AGGREGATE,
  )

  const handleSelectedTabChange = (tabId) => {
    if (tabId === TAB_IDS.TIME_SERIES) {
      queryParams.set(chartQueryParam, TAB_IDS.TIME_SERIES)
    } else {
      queryParams.delete(chartQueryParam)
    }

    updateURLParams(queryParams)
    setSelectedTab(tabId)
  }

  return { selectedTab, handleSelectedTabChange }
}

export const MetricsPaneChartTabs = ({ id, aggregatePanelContent, timeSeriesPanelContent }) => {
  const chartQueryParam = getChartParamTypeByChartId[id]
  const { selectedTab, handleSelectedTabChange } = useTabSelection(chartQueryParam)
  const tabsPanelAggregateId = `${id}-tabpanel-aggregate`
  const tabsPanelTimeSeriesId = `${id}-tabpanel-time-series`
  const isAggregateSelected = selectedTab === TAB_IDS.AGGREGATE
  const isTimeSeriesSelected = selectedTab === TAB_IDS.TIME_SERIES

  return (
    <ChartTabsWrapper>
      <TabList role="tablist">
        <Tab
          role="tab"
          type="button"
          id={TAB_IDS.AGGREGATE}
          aria-selected={isAggregateSelected}
          aria-controls={tabsPanelAggregateId}
          onClick={() => handleSelectedTabChange(TAB_IDS.AGGREGATE)}
          $tabPosition="left"
        >
          Aggregate
        </Tab>
        <Tab
          role="tab"
          type="button"
          id={TAB_IDS.TIME_SERIES}
          aria-selected={isTimeSeriesSelected}
          aria-controls={tabsPanelTimeSeriesId}
          onClick={() => handleSelectedTabChange(TAB_IDS.TIME_SERIES)}
          $tabPosition="right"
        >
          Time Series
        </Tab>
      </TabList>
      {isAggregateSelected ? (
        <TabPanel id={tabsPanelAggregateId} role="tabpanel" aria-labelledby={TAB_IDS.AGGREGATE}>
          {aggregatePanelContent}
        </TabPanel>
      ) : null}
      {isTimeSeriesSelected ? (
        <TabPanel id={tabsPanelTimeSeriesId} role="tabpanel" aria-labelledby={TAB_IDS.TIME_SERIES}>
          {timeSeriesPanelContent}
        </TabPanel>
      ) : null}
    </ChartTabsWrapper>
  )
}

MetricsPaneChartTabs.propTypes = {
  id: PropTypes.string.isRequired, //required to properly set aria-controls to be unique in the case that multiples of this component are used in the same view
  aggregatePanelContent: PropTypes.node.isRequired,
  timeSeriesPanelContent: PropTypes.node.isRequired,
}
