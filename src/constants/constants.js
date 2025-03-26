export const MAIN_MAP_ID = 'main-map'
export const PAGE_SIZE_DEFAULT = 15
export const URL_PARAMS = {
  COUNTRIES: 'countries',
  COUNTRY: 'country',
  ORGANIZATIONS: 'organizations',
  ORGANIZATION: 'organization',
  SAMPLE_DATE_AFTER: 'sample_date_after',
  SAMPLE_DATE_BEFORE: 'sample_date_before',
  PROJECTS: 'projects',
  PROJECT: 'project',
  OMITTED_METHOD_DATA_SHARING: 'omitted_method_data_sharing',
  FOLLOW_SCREEN: 'follow_screen',
  SHOW_NO_DATA_PROJECTS: 'show_no_data_projects',
  FISH_BIOMASS: 'fish_biomass',
  BENTHIC_COVER: 'benthic_cover',
  HABITAT_COMPLEXITY: 'habitat_complexity',
  BLEACHING: 'bleaching',
  VIEW: 'view',
  PAGE_INDEX: 'page_index',
  PROJECT_ID: 'project_id',
  SAMPLE_EVENT_ID: 'sample_event_id',
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

export const DOWNLOAD_METHODS = {
  beltfish: {
    description: 'Fish Belt',
    protocol: 'fishbelt',
    policy: 'data_policy_beltfish',
  },
  colonies_bleached: {
    description: 'Bleaching',
    protocol: 'bleachingqc',
    policy: 'data_policy_bleachingqc',
  },
  benthicpit: {
    description: 'Benthic PIT',
    protocol: 'benthicpit',
    policy: 'data_policy_benthicpit',
  },
  benthiclit: {
    description: 'Benthic LIT',
    protocol: 'benthiclit',
    policy: 'data_policy_benthiclit',
  },
  benthicpqt: {
    description: 'Benthic Photo Quadrat',
    protocol: 'benthicpqt',
    policy: 'data_policy_benthicpqt',
  },
  habitatcomplexity: {
    description: 'Habitat Complexity',
    protocol: 'habitatcomplexity',
    policy: 'data_policy_habitatcomplexity',
  },
}

export const POLICY_MAPPINGS = {
  bf_1: { policy: 'data_policy_beltfish', name: 'beltfish', value: 'public' },
  bf_2: {
    policy: 'data_policy_beltfish',
    name: 'beltfish',
    value: 'public summary',
  },
  bf_3: { policy: 'data_policy_beltfish', name: 'beltfish', value: 'private' },
  cb_1: {
    policy: 'data_policy_bleachingqc',
    name: 'colonies_bleached',
    value: 'public',
  },
  cb_2: {
    policy: 'data_policy_bleachingqc',
    name: 'colonies_bleached',
    value: 'public summary',
  },
  cb_3: {
    policy: 'data_policy_bleachingqc',
    name: 'colonies_bleached',
    value: 'private',
  },
  bp_1: { policy: 'data_policy_benthicpit', name: 'benthicpit', value: 'public' },
  bp_2: {
    policy: 'data_policy_benthicpit',
    name: 'benthicpit',
    value: 'public summary',
  },
  bp_3: { policy: 'data_policy_benthicpit', name: 'benthicpit', value: 'private' },
  bl_1: { policy: 'data_policy_benthiclit', name: 'benthiclit', value: 'public' },
  bl_2: {
    policy: 'data_policy_benthiclit',
    name: 'benthiclit',
    value: 'public summary',
  },
  bl_3: { policy: 'data_policy_benthiclit', name: 'benthiclit', value: 'private' },
  qbp_1: {
    policy: 'data_policy_benthicpqt',
    name: 'benthicpqt',
    value: 'public',
  },
  qbp_2: {
    policy: 'data_policy_benthicpqt',
    name: 'benthicpqt',
    value: 'public summary',
  },
  qbp_3: {
    policy: 'data_policy_benthicpqt',
    name: 'benthicpqt',
    value: 'private',
  },
  hc_1: {
    policy: 'data_policy_habitatcomplexity',
    name: 'habitatcomplexity',
    value: 'public',
  },
  hc_2: {
    policy: 'data_policy_habitatcomplexity',
    name: 'habitatcomplexity',
    value: 'public summary',
  },
  hc_3: {
    policy: 'data_policy_habitatcomplexity',
    name: 'habitatcomplexity',
    value: 'private',
  },
}
