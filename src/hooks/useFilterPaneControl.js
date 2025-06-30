import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { URL_PARAMS } from '../constants/constants'

const useFilterPaneControl = (filterType) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialShowMoreFiltersState =
    queryParams.has(URL_PARAMS.OMITTED_METHOD_DATA_SHARING) ||
    queryParams.has(URL_PARAMS.SAMPLE_DATE_AFTER) ||
    queryParams.has(URL_PARAMS.SAMPLE_DATE_BEFORE) ||
    queryParams.has(URL_PARAMS.SHOW_NO_DATA_PROJECTS) ||
    queryParams.has(URL_PARAMS.YOUR_PROJECTS_ONLY)

  const initialShowFilterPaneState =
    initialShowMoreFiltersState ||
    queryParams.has(URL_PARAMS.COUNTRY) ||
    queryParams.has(URL_PARAMS.COUNTRIES) ||
    queryParams.has(URL_PARAMS.ORGANIZATION) ||
    queryParams.has(URL_PARAMS.ORGANIZATIONS) ||
    queryParams.has(URL_PARAMS.PROJECT) ||
    queryParams.has(URL_PARAMS.PROJECTS)

  const initialValues = {
    showMoreFilters: initialShowMoreFiltersState,
    showFilterPane: initialShowFilterPaneState,
  }

  const [state, setState] = useState(initialValues[filterType] || false)

  return [state, setState]
}

export default useFilterPaneControl
