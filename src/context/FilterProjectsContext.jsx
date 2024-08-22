import PropTypes from 'prop-types'
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { URL_PARAMS, COLLECTION_METHODS } from '../constants/constants'

const isValidDateFormat = (dateString) => {
  // Regular expression to match the date format YYYY-MM-DD
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = dateString.match(regex)

  if (!match) {
    return false
  }

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const day = parseInt(match[3], 10)

  const currentYear = new Date().getFullYear()
  if (year < 1900 || year > currentYear) {
    return false
  }

  if (month < 1 || month > 12) {
    return false
  }

  // Check if the day is valid for the given month and year
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return false
  }

  return true
}

const FilterProjectsContext = createContext()

export const FilterProjectsProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [projectData, setProjectData] = useState({})
  const [countries, setCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [sampleDateAfter, setSampleDateAfter] = useState('')
  const [sampleDateBefore, setSampleDateBefore] = useState('')
  const [methodDataSharingFilters, setMethodDataSharingFilters] = useState([])
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [checkedProjects, setCheckedProjects] = useState([])
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const queryParamsSampleEventId = queryParams.get('sample_event_id')
  const initialSelectedMarker = queryParamsSampleEventId !== null ? queryParamsSampleEventId : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const [showYourData, setShowYourData] = useState(false)
  const [mermaidUserData, setMermaidUserData] = useState({})
  const [displayedOrganizations, setDisplayedOrganizations] = useState([])
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [remainingDisplayedCountries, setRemainingDisplayedCountries] = useState([])
  const [allProjectsFinishedFiltering, setAllProjectsFinishedFiltering] = useState(false)

  const getURLParams = useCallback(() => new URLSearchParams(location.search), [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const _setFiltersBasedOnUrlParams = useEffect(() => {
    const queryParams = getURLParams()

    const setFilterValue = (primaryKey, secondaryKey, setValue) => {
      if (queryParams.has(primaryKey)) {
        setValue(queryParams.getAll(primaryKey)[0].split(','))
      } else if (queryParams.has(secondaryKey)) {
        setValue(queryParams.getAll(secondaryKey)[0].split(','))
      }
    }

    const handleDateFilter = (key, setDate, formatFn) => {
      if (queryParams.has(key)) {
        const dateValue = queryParams.get(key)
        if (isValidDateFormat(dateValue)) {
          setDate(formatFn(dateValue))
        } else {
          queryParams.delete(key)
          updateURLParams(queryParams)
        }
      }
    }

    const handleMethodDataSharingFilter = () => {
      if (!queryParams.has(URL_PARAMS.METHOD_DATA_SHARING) && !queryParams.has('method')) {
        return
      }

      const queryParamsMethodDataSharing = queryParams.has('method')
        ? queryParams.getAll('method')[0].split(',')
        : queryParams.getAll(URL_PARAMS.METHOD_DATA_SHARING)[0].split(',')
      const allDataSharingOptions = COLLECTION_METHODS.flatMap(
        (method) => method.dataSharingOptions,
      )
      const validMethodDataSharing = queryParamsMethodDataSharing.filter((option) => {
        return allDataSharingOptions.includes(option)
      })
      setMethodDataSharingFilters(validMethodDataSharing)
      if (validMethodDataSharing.length === 0) {
        queryParams.delete('method')
        queryParams.delete(URL_PARAMS.METHOD_DATA_SHARING)
      } else {
        queryParams.set(URL_PARAMS.METHOD_DATA_SHARING, validMethodDataSharing)
      }
      updateURLParams(queryParams)
    }

    const setProjectNameValue = () => {
      if (queryParams.has(URL_PARAMS.PROJECTS)) {
        setProjectNameFilter(queryParams.get(URL_PARAMS.PROJECTS))
      } else if (queryParams.has('project')) {
        setProjectNameFilter(queryParams.get('project'))
      }
    }

    setFilterValue(URL_PARAMS.COUNTRIES, 'country', setSelectedCountries)
    setFilterValue(URL_PARAMS.ORGANIZATIONS, 'organization', setSelectedOrganizations)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_AFTER, setSampleDateAfter, (date) =>
      formattedDate(dayjs(date)),
    )
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_BEFORE, setSampleDateBefore, formatEndDate)
    handleMethodDataSharingFilter()
    setProjectNameValue()
  }, [getURLParams, updateURLParams])

  const doesSelectedSampleEventPassFilters = useCallback(
    (sampleEventId, projects) => {
      let displaySelectedSampleEvent = false
      projects.forEach((project) => {
        project.records.forEach((record) => {
          if (record.sample_event_id === sampleEventId) {
            displaySelectedSampleEvent = true
          }
        })
      })
      if (!displaySelectedSampleEvent) {
        queryParams.delete('sample_event_id')
        setSelectedMarkerId(null)
        updateURLParams(queryParams)
      }
    },
    [updateURLParams, queryParams],
  )

  const userIsMemberOfProject = useCallback(
    (projectId, mermaidUserData) =>
      mermaidUserData?.projects?.some((project) => project.id === projectId),
    [],
  )

  const isAnyActiveFilters = useCallback(() => {
    const anyActiveCountries = selectedCountries.length
    const anyActiveOrganizations = selectedOrganizations.length
    const anyActiveSampleDateAfter = sampleDateAfter
    const anyActiveSampleDateBefore = sampleDateBefore
    const showYourDataOnly = showYourData
    const anyInactiveMethodDataSharing = methodDataSharingFilters.length > 0
    const anyActiveProjects = projectNameFilter

    return (
      anyActiveCountries ||
      anyActiveOrganizations ||
      anyActiveSampleDateAfter ||
      anyActiveSampleDateBefore ||
      showYourDataOnly ||
      anyInactiveMethodDataSharing ||
      anyActiveProjects
    )
  }, [
    selectedCountries,
    selectedOrganizations,
    sampleDateAfter,
    sampleDateBefore,
    showYourData,
    methodDataSharingFilters,
    projectNameFilter,
  ])

  const applyFilterToProjects = useCallback(
    (selectedCountries, selectedOrganizations) => {
      const fallbackSampleDateAfter = new Date('1970-01-01')
      const fallbackSampleDateBefore = new Date(Date.now())

      return projectData.results
        .map((project) => {
          // Filter project if sample date falls within selected date range
          if (!sampleDateAfter && !sampleDateBefore) {
            return project
          }
          const beginDate = sampleDateAfter || fallbackSampleDateAfter
          const finishDate = sampleDateBefore || fallbackSampleDateBefore
          return {
            ...project,
            records: project.records.filter((record) => {
              const recordDate = new Date(record.sample_date)
              return recordDate <= new Date(finishDate) && recordDate >= new Date(beginDate)
            }),
          }
        })
        .map((project) => {
          const policyMappings = {
            bf_0: { policy: 'data_policy_beltfish', name: 'beltfish', value: 'public' },
            bf_1: {
              policy: 'data_policy_beltfish',
              name: 'beltfish',
              value: 'public summary',
            },
            bf_2: { policy: 'data_policy_beltfish', name: 'beltfish', value: 'private' },
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
              name: 'quadrat_benthic_percent',
              value: 'public',
            },
            qbp_2: {
              policy: 'data_policy_benthicpqt',
              name: 'quadrat_benthic_percent',
              value: 'public summary',
            },
            qbp_3: {
              policy: 'data_policy_benthicpqt',
              name: 'quadrat_benthic_percent',
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

          const filteredRecords = project.records.filter((record) => {
            return methodDataSharingFilters.every((filter) => {
              const { policy, value, name } = policyMappings[filter] || {}
              return record[policy] !== value && record.protocols?.[name]?.sample_unit_count
            })
          })

          return {
            ...project,
            records: filteredRecords,
          }
        })

        .filter((project) => {
          // Filter by selected countries
          const matchesSelectedCountries =
            selectedCountries.length === 0 ||
            selectedCountries.includes(project.records[0]?.country_name)

          // Filter by selected organizations
          const matchesSelectedOrganizations =
            selectedOrganizations.length === 0 ||
            project.records[0]?.tags?.some((tag) => selectedOrganizations.includes(tag.name))

          // Filter by project name
          const matchesProjectName =
            projectNameFilter === '' ||
            project.project_name.toLowerCase().includes(projectNameFilter.toLowerCase())

          // Filter out projects that the user is not a member of
          const onlyShowProjectsUserIsAMemberOf = showYourData
            ? userIsMemberOfProject(project.project_id, mermaidUserData)
            : true

          // Filter out projects that have no records
          const projectHasRecords = isAnyActiveFilters() && !project.records.length ? false : true

          const isProjectVisible =
            matchesSelectedCountries &&
            matchesSelectedOrganizations &&
            matchesProjectName &&
            onlyShowProjectsUserIsAMemberOf &&
            projectHasRecords

          return isProjectVisible
        })
    },
    [
      projectData.results,
      userIsMemberOfProject,
      mermaidUserData,
      methodDataSharingFilters,
      projectNameFilter,
      sampleDateAfter,
      sampleDateBefore,
      showYourData,
      isAnyActiveFilters,
    ],
  )

  const _filterProjectRecords = useEffect(() => {
    if (!projectData.results) {
      return
    }

    const filteredProjects = applyFilterToProjects(selectedCountries, selectedOrganizations)
    console.log('filteredProjects', filteredProjects)
    const paramsSampleEventId =
      queryParams.has('sample_event_id') && queryParams.get('sample_event_id')
    doesSelectedSampleEventPassFilters(paramsSampleEventId, filteredProjects)

    setDisplayedProjects(
      filteredProjects.sort((a, b) => a.project_name.localeCompare(b.project_name)),
    )
    if (projectData.results.length === projectData.count) {
      setAllProjectsFinishedFiltering(true)
    }
  }, [
    projectData.results,
    projectData.count,
    selectedCountries,
    selectedOrganizations,
    projectNameFilter,
    sampleDateAfter,
    sampleDateBefore,
    methodDataSharingFilters,
    doesSelectedSampleEventPassFilters,
    setDisplayedProjects,
    showYourData,
    applyFilterToProjects,
    queryParams,
  ])

  const countriesSelectOnOpen = () => {
    const filteredProjects = applyFilterToProjects([], selectedOrganizations)
    const uniqueCountries = [
      ...new Set(
        filteredProjects
          .map((project) => {
            if (selectedOrganizations.length === 0) {
              return project.records[0]?.country_name
            } else {
              return (
                selectedOrganizations.some((organization) =>
                  project.records[0]?.tags?.map((tag) => tag.name).includes(organization),
                ) && project.records[0]?.country_name
              )
            }
          })
          .filter((country) => country !== undefined && country !== false)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ]
    const remainingCountries = countries.filter((country) => !uniqueCountries.includes(country))
    setDisplayedCountries(uniqueCountries)
    setRemainingDisplayedCountries(remainingCountries)
  }

  const organizationsSelectOnOpen = () => {
    const filteredProjects = applyFilterToProjects(selectedCountries, [])
    const uniqueOrganizations = [
      ...new Set(
        filteredProjects
          .map((project) => {
            if (selectedCountries.length === 0) {
              return project.records[0]?.tags?.map((tag) => tag.name)
            } else {
              return (
                selectedCountries.includes(project.records[0]?.country_name) &&
                project.records[0]?.tags?.map((tag) => tag.name)
              )
            }
          })
          .flat()
          .filter((org) => org !== undefined && org !== false)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ]
    setDisplayedOrganizations(uniqueOrganizations)
  }
  const _removeSampleIdParamsIfDoesntPassFilters = useEffect(() => {
    if (!allProjectsFinishedFiltering) {
      return
    }
    const paramsSampleEventId =
      queryParams.has('sample_event_id') && queryParams.get('sample_event_id')
    doesSelectedSampleEventPassFilters(paramsSampleEventId, displayedProjects)
  }, [
    allProjectsFinishedFiltering,
    displayedProjects,
    queryParams,
    doesSelectedSampleEventPassFilters,
  ])

  const handleSelectedCountriesChange = (event) => {
    const queryParams = getURLParams()
    const selectedCountries = event.target.value
    if (selectedCountries.length === 0) {
      queryParams.delete(URL_PARAMS.COUNTRIES)
    } else {
      queryParams.set(URL_PARAMS.COUNTRIES, selectedCountries)
    }
    queryParams.delete('country')
    updateURLParams(queryParams)
    setSelectedCountries(selectedCountries)
  }

  const handleSelectedOrganizationsChange = (event) => {
    const queryParams = getURLParams()
    const selectedOrganizations = event.target.value
    if (selectedOrganizations.length === 0) {
      queryParams.delete(URL_PARAMS.ORGANIZATIONS)
    } else {
      queryParams.set(URL_PARAMS.ORGANIZATIONS, selectedOrganizations)
    }
    queryParams.delete('organization')
    updateURLParams(queryParams)
    setSelectedOrganizations(selectedOrganizations)
  }

  const formattedDate = (date) => {
    return !date ? '' : dayjs(date).format('YYYY-MM-DD')
  }

  const formatEndDate = (date) => {
    return dayjs(date).set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999)
  }

  const handleChangeSampleDateAfter = (sampleDateAfter) => {
    const queryParams = getURLParams()
    if (sampleDateAfter === '') {
      queryParams.delete(URL_PARAMS.SAMPLE_DATE_AFTER)
      setSampleDateAfter('')
    } else {
      const formattedSampleDateAfter = formattedDate(sampleDateAfter)
      queryParams.set(URL_PARAMS.SAMPLE_DATE_AFTER, formattedSampleDateAfter)
      setSampleDateAfter(dayjs(sampleDateAfter))
    }
    updateURLParams(queryParams)
  }

  const handleChangeSampleDateBefore = (sampleDateBefore) => {
    const queryParams = getURLParams()
    if (sampleDateBefore === '') {
      queryParams.delete(URL_PARAMS.SAMPLE_DATE_BEFORE)
      setSampleDateBefore('')
    } else {
      const formattedSampleDateBefore = formattedDate(sampleDateBefore)
      queryParams.set(URL_PARAMS.SAMPLE_DATE_BEFORE, formattedSampleDateBefore)
      setSampleDateBefore(formatEndDate(sampleDateBefore))
    }
    updateURLParams(queryParams)
  }

  const handleMethodDataSharingFilter = (event) => {
    const { checked, name } = event.target
    const foundMethod = COLLECTION_METHODS.find((method) =>
      method.dataSharingOptions.includes(name),
    )
    const [allOption, ...subOptions] = foundMethod.dataSharingOptions
    let updatedFilter = [...methodDataSharingFilters]
    if (name.includes('all')) {
      updatedFilter = checked
        ? updatedFilter.filter((method) => !foundMethod.dataSharingOptions.includes(method))
        : [...updatedFilter, ...foundMethod.dataSharingOptions]
    } else {
      if (!checked) {
        // unchecking a sub-option (not 'all')
        updatedFilter.push(name)
        if (subOptions.every((option) => updatedFilter.includes(option))) {
          updatedFilter.push(allOption)
        }
      } else {
        // checking a sub-option (not 'all')
        updatedFilter = [...methodDataSharingFilters].filter((filter) => filter !== name)

        // Remove the 'all' option if at least one sub-option is checked
        if (!subOptions.every((option) => updatedFilter.includes(option))) {
          updatedFilter = updatedFilter.filter((filter) => filter !== allOption)
        }
      }
    }
    updatedFilter = [...new Set(updatedFilter)]
    const queryParams = getURLParams()
    if (updatedFilter.length === 0) {
      queryParams.delete(URL_PARAMS.METHOD_DATA_SHARING)
    } else {
      queryParams.set(URL_PARAMS.METHOD_DATA_SHARING, updatedFilter)
    }
    queryParams.delete('method')
    updateURLParams(queryParams)
    setMethodDataSharingFilters(updatedFilter)
  }

  const handleProjectNameFilter = (event) => {
    const queryParams = getURLParams()
    const projectName = event.target.value
    if (projectName.length === 0) {
      queryParams.delete(URL_PARAMS.PROJECTS)
    } else {
      queryParams.set(URL_PARAMS.PROJECTS, projectName)
    }
    queryParams.delete('project')
    updateURLParams(queryParams)
    setProjectNameFilter(projectName)
  }

  const clearAllFilters = () => {
    const queryParams = getURLParams()
    Object.values(URL_PARAMS).forEach((value) => {
      queryParams.delete(value)
    })
    updateURLParams(queryParams)
    setSelectedCountries([])
    setSelectedOrganizations([])
    setSampleDateAfter('')
    setSampleDateBefore('')
    setMethodDataSharingFilters([])
    setProjectNameFilter('')
    setShowYourData(false)
    updateURLParams(queryParams)
  }

  const handleYourDataFilter = (event) => {
    const { checked } = event.target
    setShowYourData(checked)
  }

  const getActiveProjectCount = () => {
    let count = 0

    displayedProjects.forEach((project) => {
      if (checkedProjects.includes(project.project_id)) {
        count++
      }
    })

    return count
  }

  return (
    <FilterProjectsContext.Provider
      value={{
        URL_PARAMS,
        projectData,
        setProjectData,
        countries,
        setCountries,
        organizations,
        setOrganizations,
        projectDataCount: projectData?.count || 0,
        displayedProjects,
        setDisplayedProjects,
        selectedCountries,
        setSelectedCountries,
        selectedOrganizations,
        setSelectedOrganizations,
        sampleDateAfter,
        setSampleDateAfter,
        sampleDateBefore,
        setSampleDateBefore,
        methodDataSharingFilters,
        setMethodDataSharingFilters,
        projectNameFilter,
        setProjectNameFilter,
        selectedMarkerId,
        setSelectedMarkerId,
        checkedProjects,
        setCheckedProjects,
        showYourData,
        setShowYourData,
        mermaidUserData,
        setMermaidUserData,
        handleSelectedCountriesChange,
        handleSelectedOrganizationsChange,
        formattedDate,
        formatEndDate,
        handleChangeSampleDateAfter,
        handleChangeSampleDateBefore,
        handleMethodDataSharingFilter,
        handleProjectNameFilter,
        clearAllFilters,
        handleYourDataFilter,
        userIsMemberOfProject,
        displayedCountries,
        setDisplayedCountries,
        remainingDisplayedCountries,
        displayedOrganizations,
        setDisplayedOrganizations,
        countriesSelectOnOpen,
        organizationsSelectOnOpen,
        getActiveProjectCount,
        getURLParams,
        updateURLParams,
        isAnyActiveFilters,
      }}
    >
      {children}
    </FilterProjectsContext.Provider>
  )
}

export const useFilterProjectsContext = () => useContext(FilterProjectsContext)

FilterProjectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
