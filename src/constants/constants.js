export const MAIN_MAP_ID = 'main-map'
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
    protocol: 'fishbelt',
    policyName: 'data_policy_beltfish',
    dataSharingOptions: ['bf_all', 'bf_1', 'bf_2', 'bf_3'],
  },
  colonies_bleached: {
    description: 'Bleaching',
    protocol: 'bleachingqc',
    policyName: 'data_policy_bleachingqc',
    dataSharingOptions: ['cb_all', 'cb_1', 'cb_2', 'cb_3'],
  },
  benthicpit: {
    description: 'Benthic PIT',
    protocol: 'benthicpit',
    policyName: 'data_policy_benthicpit',
    dataSharingOptions: ['bp_all', 'bp_1', 'bp_2', 'bp_3'],
  },
  benthiclit: {
    description: 'Benthic LIT',
    protocol: 'benthiclit',
    policyName: 'data_policy_benthiclit',
    dataSharingOptions: ['bl_all', 'bl_1', 'bl_2', 'bl_3'],
  },
  quadrat_benthic_percent: {
    description: 'Benthic Photo Quadrat',
    protocol: 'benthicpqt',
    policyName: 'data_policy_benthicpqt',
    dataSharingOptions: ['qbp_all', 'qbp_1', 'qbp_2', 'qbp_3'],
  },
  habitatcomplexity: {
    description: 'Habitat Complexity',
    protocol: 'habitatcomplexity',
    policyName: 'data_policy_habitatcomplexity',
    dataSharingOptions: ['hc_all', 'hc_1', 'hc_2', 'hc_3'],
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
