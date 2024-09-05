export const PAGE_SIZE_DEFAULT = 15
export const URL_PARAMS = {
  COUNTRIES: 'countries',
  ORGANIZATIONS: 'organizations',
  SAMPLE_DATE_AFTER: 'sample_date_after',
  SAMPLE_DATE_BEFORE: 'sample_date_before',
  PROJECTS: 'projects',
  METHOD_DATA_SHARING: 'omitted_method_data_sharing',
  FOLLOW_SCREEN: 'follow_screen',
}

export const COLLECTION_METHODS = {
  beltfish: {
    description: 'Fish Belt',
    dataSharingOptions: ['bf_all', 'bf_1', 'bf_2', 'bf_3'],
  },
  colonies_bleached: {
    description: 'Bleaching',
    dataSharingOptions: ['cb_all', 'cb_1', 'cb_2', 'cb_3'],
  },
  benthicpit: {
    description: 'Benthic PIT',
    dataSharingOptions: ['bp_all', 'bp_1', 'bp_2', 'bp_3'],
  },
  benthiclit: {
    description: 'Benthic LIT',
    dataSharingOptions: ['bl_all', 'bl_1', 'bl_2', 'bl_3'],
  },
  quadrat_benthic_percent: {
    description: 'Benthic Photo Quadrat',
    dataSharingOptions: ['qbp_all', 'qbp_1', 'qbp_2', 'qbp_3'],
  },
  habitatcomplexity: {
    description: 'Habitat Complexity',
    dataSharingOptions: ['hc_all', 'hc_1', 'hc_2', 'hc_3'],
  },
}
