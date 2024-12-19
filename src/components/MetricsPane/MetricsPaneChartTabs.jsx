import { useState } from 'react'
import PropTypes from 'prop-types'

import { ChartTabsWrapper, Tab, TabList, TabPanel } from './MetricsPaneChartTabs.styles'
const TAB_IDS = {
  AGGREGATE: 'aggregate',
  TIME_SERIES: 'timeSeries',
}

export const MetricsPaneChartTabs = ({ id, aggregatePanelContent, timeSeriesPanelContent }) => {
  const [selectedTab, setSelectedTab] = useState(TAB_IDS.AGGREGATE)
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
          onClick={() => setSelectedTab(TAB_IDS.AGGREGATE)}
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
          onClick={() => setSelectedTab(TAB_IDS.TIME_SERIES)}
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
