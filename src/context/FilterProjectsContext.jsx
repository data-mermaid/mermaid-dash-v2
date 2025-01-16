import PropTypes from 'prop-types'
import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { URL_PARAMS, COLLECTION_METHODS, POLICY_MAPPINGS } from '../constants/constants'

export const FilterProjectsContext = createContext()

export const FilterProjectsProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [projectData, setProjectData] = useState({})
  const [countries, setCountries] = useState([])
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [sampleDateAfter, setSampleDateAfter] = useState(null)
  const [sampleDateBefore, setSampleDateBefore] = useState(null)
  const [methodDataSharingFilters, setMethodDataSharingFilters] = useState([])
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [checkedProjects, setCheckedProjects] = useState([])
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const queryParamsSampleEventId = queryParams.get('sample_event_id')
  const initialSelectedMarker = queryParamsSampleEventId !== null ? queryParamsSampleEventId : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showYourData, setShowYourData] = useState(false)
  const [mermaidUserData, setMermaidUserData] = useState({})
  const [displayedOrganizations, setDisplayedOrganizations] = useState([])
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [remainingDisplayedCountries, setRemainingDisplayedCountries] = useState([])
  const [allProjectsFinishedFiltering, setAllProjectsFinishedFiltering] = useState(false)
  const [showProjectsWithNoRecords, setShowProjectsWithNoRecords] = useState(false)
  const [enableFollowScreen, setEnableFollowScreen] = useState(false)
  const [mapBbox, setMapBbox] = useState({})

  const filteredSurveys = displayedProjects
    .filter((project) => checkedProjects.includes(project.project_id))
    .flatMap((project) => project.records)

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

    const handleDateFilter = (key, setDate, isEndDate) => {
      if (queryParams.has(key)) {
        // Get Date w/ Strict Check Validation: https://day.js.org/docs/en/parse/is-valid
        const dateValue = dayjs(queryParams.get(key), 'YYYY-MM-DD', true)
        if (dateValue.isValid()) {
          setDate(isEndDate ? formatEndDate(dateValue) : dateValue)
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
      const allDataSharingOptions = Object.values(COLLECTION_METHODS).flatMap(
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

    const setFollowScreen = () => {
      if (queryParams.has(URL_PARAMS.FOLLOW_SCREEN)) {
        setEnableFollowScreen(true)
      }
    }

    setFilterValue(URL_PARAMS.COUNTRIES, 'country', setSelectedCountries)
    setFilterValue(URL_PARAMS.ORGANIZATIONS, 'organization', setSelectedOrganizations)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_AFTER, setSampleDateAfter)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_BEFORE, setSampleDateBefore, true)
    handleMethodDataSharingFilter()
    setProjectNameValue()
    setFollowScreen()
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
    const followScreenEnabled = enableFollowScreen

    return (
      anyActiveCountries ||
      anyActiveOrganizations ||
      anyActiveSampleDateAfter ||
      anyActiveSampleDateBefore ||
      showYourDataOnly ||
      anyInactiveMethodDataSharing ||
      anyActiveProjects ||
      followScreenEnabled
    )
  }, [
    selectedCountries,
    selectedOrganizations,
    sampleDateAfter,
    sampleDateBefore,
    showYourData,
    methodDataSharingFilters,
    projectNameFilter,
    enableFollowScreen,
  ])

  const isRecordWithinMapBounds = useCallback((record, mapBbox) => {
    const isWithinLatitude =
      record.latitude >= mapBbox['_sw'].lat && record.latitude <= mapBbox['_ne'].lat

    const normalizeLng = (lng) => {
      // Use modulo to handle any number of rotations around the globe
      lng = (lng + 180) % 360
      // Adjust the result to be in the range [-180, 180)
      if (lng < 0) {
        lng += 360
      }

      return lng - 180
    }

    const swLng = normalizeLng(mapBbox['_sw'].lng)
    const neLng = normalizeLng(mapBbox['_ne'].lng)

    const isWithinLongitude =
      swLng <= neLng
        ? record.longitude >= swLng && record.longitude <= neLng
        : record.longitude >= swLng || record.longitude <= neLng

    return isWithinLatitude && isWithinLongitude
  }, [])

  const applyFilterToProjects = useCallback(
    (selectedCountries, selectedOrganizations) => {
      const fallbackSampleDateAfter = new Date('1970-01-01')
      const fallbackSampleDateBefore = new Date(Date.now())
      const noDataProjects = [
        ...projectData.results
          .filter(({ records }) => records.length === 0)
          .map(({ project_id }) => project_id),
      ]

      return projectData.results
        ?.filter((project) => {
          // Filter by selected countries
          const matchesSelectedCountries =
            selectedCountries.length === 0 ||
            selectedCountries.includes(project.records[0]?.country_name)

          // Filter by selected organizations
          const matchesSelectedOrganizations =
            selectedOrganizations.length === 0 ||
            project.tags?.map((tag) => tag.name).some((tag) => selectedOrganizations.includes(tag))

          // Filter by project name
          const matchesProjectName =
            projectNameFilter === '' ||
            project.project_name.toLowerCase().includes(projectNameFilter.toLowerCase())

          // Filter out projects that the user is not a member of
          const onlyShowProjectsUserIsAMemberOf = showYourData
            ? userIsMemberOfProject(project.project_id, mermaidUserData)
            : true

          const isProjectVisible =
            matchesSelectedCountries &&
            matchesSelectedOrganizations &&
            matchesProjectName &&
            onlyShowProjectsUserIsAMemberOf

          return isProjectVisible
        })
        .map((project) => {
          // Applies date filters
          if (!sampleDateAfter && !sampleDateBefore) {
            return project
          }
          const beginDate = sampleDateAfter?.toDate() || fallbackSampleDateAfter
          const finishDate = sampleDateBefore?.toDate() || fallbackSampleDateBefore
          return {
            ...project,
            records: project.records.filter((record) => {
              const recordDate = new Date(record.sample_date)
              return recordDate <= finishDate && recordDate >= beginDate
            }),
          }
        })
        .map((project) => {
          // Applies method data sharing filters
          const filteredRecords = project.records.filter((record) => {
            const recordHasSampleUnitsAndMatches = !methodDataSharingFilters.some((filter) => {
              const { policy, value, name } = POLICY_MAPPINGS[filter] || {}
              const sampleUnitExists = record.protocols[name]?.sample_unit_count !== undefined
              const isPolicyValueMatch = record[policy] === value
              return sampleUnitExists && isPolicyValueMatch
            })
            return recordHasSampleUnitsAndMatches
          })

          return {
            ...project,
            records: filteredRecords,
          }
        })
        .map((project) => {
          // Filter by map bounding box
          if (!enableFollowScreen) {
            return project
          }

          return {
            ...project,
            records: project.records.filter((record) => isRecordWithinMapBounds(record, mapBbox)),
          }
        })
        .filter((project) => {
          if (showProjectsWithNoRecords) {
            // If showProjectsWithNoRecords toggled on, show projects that is in the noDataProjects list or has records
            return noDataProjects.includes(project.project_id) || project.records.length > 0
          }

          // Else only show projects that has records
          return project.records.length > 0
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
      showProjectsWithNoRecords,
      enableFollowScreen,
      isRecordWithinMapBounds,
      mapBbox,
    ],
  )

  const _filterProjectRecords = useEffect(() => {
    if (!projectData.results) {
      return
    }

    const filteredProjects = applyFilterToProjects(selectedCountries, selectedOrganizations)
    const paramsSampleEventId =
      queryParams.has('sample_event_id') && queryParams.get('sample_event_id')
    if (projectData.results.length === projectData.count) {
      doesSelectedSampleEventPassFilters(paramsSampleEventId, filteredProjects)
    }

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
    enableFollowScreen,
    mapBbox,
  ])

  const countriesSelectOnOpen = () => {
    const filteredProjects = applyFilterToProjects([], selectedOrganizations)
    const uniqueCountries = [
      ...new Set(
        filteredProjects
          ?.map((project) => {
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

  const handleChangeSampleDateAfter = (newSampleDateAfter) => {
    const queryParams = getURLParams()
    if (newSampleDateAfter === null) {
      queryParams.delete(URL_PARAMS.SAMPLE_DATE_AFTER)
      setSampleDateAfter(null)
    } else {
      const formattedSampleDateAfter = formattedDate(newSampleDateAfter)
      queryParams.set(URL_PARAMS.SAMPLE_DATE_AFTER, formattedSampleDateAfter)
      setSampleDateAfter(newSampleDateAfter)
    }
    updateURLParams(queryParams)
  }

  const handleChangeSampleDateBefore = (newSampleDateBefore) => {
    const queryParams = getURLParams()
    if (newSampleDateBefore === null) {
      queryParams.delete(URL_PARAMS.SAMPLE_DATE_BEFORE)
      setSampleDateBefore(null)
    } else {
      const formattedSampleDateBefore = formattedDate(newSampleDateBefore)
      queryParams.set(URL_PARAMS.SAMPLE_DATE_BEFORE, formattedSampleDateBefore)
      setSampleDateBefore(formatEndDate(newSampleDateBefore))
    }
    updateURLParams(queryParams)
  }

  const handleMethodDataSharingFilter = (event) => {
    const { checked, name } = event.target
    const foundMethod = Object.values(COLLECTION_METHODS).find((value) =>
      value.dataSharingOptions.includes(name),
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
        updatedFilter = updatedFilter.filter((f) => f !== name)

        // Remove the 'all' option if at least one sub-option is checked
        if (!subOptions.every((option) => updatedFilter.includes(option))) {
          updatedFilter = updatedFilter.filter((f) => f !== allOption)
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
    setSampleDateAfter(null)
    setSampleDateBefore(null)
    setMethodDataSharingFilters([])
    setProjectNameFilter('')
    setShowYourData(false)
    setEnableFollowScreen(false)
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

  const updateCurrentSampleEvent = useCallback(
    (sampleEventId) => {
      const newQueryParams = new URLSearchParams(location.search)
      newQueryParams.set('sample_event_id', sampleEventId)
      updateURLParams(newQueryParams)
      setSelectedMarkerId(sampleEventId)
    },
    [location.search, updateURLParams],
  )

  return (
    <FilterProjectsContext.Provider
      value={{
        checkedProjects,
        clearAllFilters,
        countriesSelectOnOpen,
        displayedCountries,
        displayedOrganizations,
        displayedProjects,
        filteredSurveys,
        enableFollowScreen,
        formattedDate,
        getActiveProjectCount,
        getURLParams,
        handleChangeSampleDateAfter,
        handleChangeSampleDateBefore,
        handleMethodDataSharingFilter,
        handleProjectNameFilter,
        handleSelectedCountriesChange,
        handleSelectedOrganizationsChange,
        handleYourDataFilter,
        isAnyActiveFilters,
        mermaidUserData,
        methodDataSharingFilters,
        organizationsSelectOnOpen,
        projectData,
        projectDataCount: projectData?.count || 0,
        projectNameFilter,
        remainingDisplayedCountries,
        sampleDateAfter,
        sampleDateBefore,
        selectedCountries,
        selectedMarkerId,
        selectedOrganizations,
        selectedProject,
        setCheckedProjects,
        setCountries,
        setDisplayedCountries,
        setDisplayedOrganizations,
        setEnableFollowScreen,
        setMapBbox,
        setMermaidUserData,
        setProjectData,
        setSelectedCountries,
        setSelectedMarkerId,
        setSelectedOrganizations,
        setSelectedProject,
        setShowProjectsWithNoRecords,
        setShowYourData,
        showProjectsWithNoRecords,
        showYourData,
        updateCurrentSampleEvent,
        updateURLParams,
        userIsMemberOfProject,
      }}
    >
      {children}
    </FilterProjectsContext.Provider>
  )
}

FilterProjectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
