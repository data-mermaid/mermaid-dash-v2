export const headerText = {
  redirectDashboard: 'Launch MERMAID',
}

export const shareView = {
  headerButton: 'Share this view',
  modalHeader: 'Share this view of the dashboard',
}

export const filterPane = {
  dataSharing: 'Only show data you have access to',
  yourData: 'Your Projects Only',
}

export const dataDisclaimer = {
  title: 'Data Disclaimer',
  content:
    'Do not assume data are representative. Some projects have survey sites in geographies to address specific questions (e.g., land-based impacts of reefs, recovery rates from cyclone impacts). Summary data may not reflect overall national statistics.',
}

export const exportModal = {
  noDataTitle: 'No data to export',
  noDataContent: 'Selected projects contain no data to export.',
  exportTitle: (selectedMethod) => `Export ${selectedMethod} Data`,
  noGFCRDataTitle: 'No GFCR data to export',
  noGFCRDataContent: 'No filtered projects have GFCR indicators.',
  exportGFCRTitle: 'Export GFCR data',
  successTitle: 'Export Request Sent',
  failureTitle: 'Export Failed',
  failureContent: 'Fail to sent email! Please contact MERMAID team.',
}

export const errorModal = {
  title: 'Error fetching data',
  content:
    'There was an issue getting data for the Dashboard. If this problem persists, please contact',
}

export const successExportModal = {
  title: 'Export Successful',
  content: (email) => {
    return `An email has been sent to ${email}. This can sometimes take up to 15 minutes.`
  },
  citationHeader: 'Please credit the data owners.',
  citationContent:
    'Suggested citations can be found in all tabs of xlsx files you are exporting. Please ensure you cite the data you have exported in any publications to properly credit the data owners.',
  footerButton: 'Done',
}

export const pages = {
  submittedTable: {
    filterSearchHelperText: {
      __html:
        '<p>Use the search bar to filter the table by any text in the table. For example, search for a project name, organization, or location.</p>',
    },
  },
}

export const table = {
  sortAscendingTitle: 'Sort ascending',
  sortDescendingTitle: 'Sort descending',
  sortRemoveTitle: 'Remove sort',
  noFilterResults: 'No results',
  noFilterResultsSubText: 'No records match the current filter term.',
}

export const tooltipText = {
  showFilters: 'Show filters',
  hideFilters: 'Hide filters',
  showMetrics: 'Show metrics',
  hideMetrics: 'Hide metrics',
  mapView: 'Map View',
  tableView: 'Table View',
  enableFollowMap: 'Enable metrics update based on map view',
  disableFollowMap: 'Disable metrics update based on map view',
  zoomToData: 'Zoom to filtered data',
  showAllData: 'Show all data',
  downloadData: 'Download data',
  yourProject: 'You are part of this project',
  contactAdmins: 'Contact admins',
  hardCoralCoverInfo: 'More information & references',
}

export const toastMessageText = {
  followMapEnabled: 'Metrics will now update based on the map view',
  followMapDisabled: 'Metrics will no longer update based on the map view',
  sendEmailFailed: 'Failed to send email. Please try again',
}

export const autocompleteGroupNames = {
  countriesBasedOnCurrentFilters: 'Countries based on current filters',
  otherCountries: 'Other countries',
  organizationsBasedOnCurrentFilters: 'Organizations based on current filters',
  noOrganizationsMatchCurrentFilters: 'No organizations match current filters',
  projectsBasedOnCurrentFilters: 'Projects based on current filters',
  otherProjects: 'Other projects',
}

export const noDataText = {
  noMethodData: 'No Data',
  noYearRange: 'No data to obtain year range',
  noTableData: 'No project data',
  noProjectsOnCurrentFilters: 'No projects match current filters',
  noChartsOnCurrentFilters: ['No data to show visualizations.', 'Try refining your filters.'],
}

export const mapAttributeText =
  'Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
