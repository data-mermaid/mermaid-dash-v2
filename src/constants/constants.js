export const PAGE_SIZE_DEFAULT = 15
export const URL_PARAMS = {
  COUNTRIES: 'countries',
  ORGANIZATIONS: 'organizations',
  SAMPLE_DATE_AFTER: 'sample_date_after',
  SAMPLE_DATE_BEFORE: 'sample_date_before',
  PROJECTS: 'projects',
  DATA_SHARING: 'dataSharing',
  METHODS: 'methods',
}
export const COLLECTION_METHODS = [
  {
    name: 'beltfish',
    description: 'Fish Belt',
  },
  { name: 'colonies_bleached', description: 'Bleaching' },
  { name: 'benthicpit', description: 'Benthic PIT' },
  { name: 'benthiclit', description: 'Benthic LIT' },
  { name: 'quadrat_benthic_percent', description: 'Benthic Photo Quadrat' },
  { name: 'habitatcomplexity', description: 'Habitat Complexity' },
]

export const DATA_SHARING_OPTIONS = {
  public: ['pu-all', 'pu-1', 'pu-2', 'pu-3'],
  publicSummary: ['ps-all', 'ps-1', 'ps-2', 'ps-3'],
  private: ['pr-all', 'pr-1', 'pr-2', 'pr-3'],
}
