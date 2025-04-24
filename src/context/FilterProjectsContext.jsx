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
  const [displayedProjectNames, setDisplayedProjectNames] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [sampleDateAfter, setSampleDateAfter] = useState(null)
  const [sampleDateBefore, setSampleDateBefore] = useState(null)
  const [omittedMethodDataSharingFilters, setOmittedMethodDataSharingFilters] = useState([])
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const queryParamsSampleEventId = queryParams.get(URL_PARAMS.SAMPLE_EVENT_ID)
  const initialSelectedMarker = queryParamsSampleEventId !== null ? queryParamsSampleEventId : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showYourData, setShowYourData] = useState(false)
  const [mermaidUserData, setMermaidUserData] = useState({})
  const [displayedOrganizations, setDisplayedOrganizations] = useState([])
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [remainingDisplayedCountries, setRemainingDisplayedCountries] = useState([])
  const [remainingDisplayedProjectNames, setRemainingDisplayedProjectNames] = useState([])
  const [allProjectsFinishedFiltering, setAllProjectsFinishedFiltering] = useState(false)
  const [showProjectsWithNoRecords, setShowProjectsWithNoRecords] = useState(true)
  const [enableFollowScreen, setEnableFollowScreen] = useState(true)
  const [mapBbox, setMapBbox] = useState({})

  const filteredSurveys = displayedProjects.flatMap((project) => project.records)

  const getURLParams = useCallback(() => new URLSearchParams(location.search), [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const updateSelectInputQueryParams = (selectedItems, singularParam, pluralParam, setValues) => {
    const queryParams = getURLParams()
    const encodedItems = selectedItems.map(encodeURIComponent)

    queryParams.delete(singularParam)
    queryParams.delete(pluralParam)

    if (selectedItems.length === 1) {
      queryParams.set(singularParam, encodedItems[0])
    } else if (selectedItems.length > 1) {
      queryParams.set(pluralParam, encodedItems.join(','))
    }

    updateURLParams(queryParams)
    setValues(selectedItems)
  }

  const _setFiltersBasedOnUrlParams = useEffect(() => {
    const queryParams = getURLParams()

    const handleSelectInputFilter = (keys, setValues) => {
      const selectedValues = keys.reduce((acc, key) => {
        if (queryParams.has(key)) {
          return queryParams.getAll(key)[0].split(',').map(decodeURIComponent)
        }
        return acc
      }, [])

      if (selectedValues.length > 0) {
        setValues(selectedValues)
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
      if (!queryParams.has(URL_PARAMS.OMITTED_METHOD_DATA_SHARING)) {
        return
      }

      const queryParamsOmittedMethodDataSharing = queryParams
        .getAll(URL_PARAMS.OMITTED_METHOD_DATA_SHARING)[0]
        .split(',')

      const allDataSharingOptions = Object.values(COLLECTION_METHODS).flatMap(
        (method) => method.dataSharingOptions,
      )

      const validOmittedMethodDataSharing = queryParamsOmittedMethodDataSharing.filter((option) => {
        return allDataSharingOptions.includes(option)
      })

      setOmittedMethodDataSharingFilters(validOmittedMethodDataSharing)
      if (validOmittedMethodDataSharing.length === 0) {
        queryParams.delete(URL_PARAMS.OMITTED_METHOD_DATA_SHARING)
      } else {
        queryParams.set(URL_PARAMS.OMITTED_METHOD_DATA_SHARING, validOmittedMethodDataSharing)
      }
      updateURLParams(queryParams)
    }

    const setFollowScreen = () => {
      if (queryParams.has(URL_PARAMS.FOLLOW_SCREEN)) {
        setEnableFollowScreen(true)
      }
    }

    const setShowProjectsWithNoData = () => {
      if (queryParams.has(URL_PARAMS.SHOW_NO_DATA_PROJECTS)) {
        setShowProjectsWithNoRecords(false)
      }
    }

    const setShowYourProjectsOnly = () => {
      if (queryParams.has(URL_PARAMS.YOUR_PROJECTS_ONLY)) {
        setShowYourData(true)
      }
    }

    handleSelectInputFilter([URL_PARAMS.COUNTRY, URL_PARAMS.COUNTRIES], setSelectedCountries)
    handleSelectInputFilter(
      [URL_PARAMS.ORGANIZATION, URL_PARAMS.ORGANIZATIONS],
      setSelectedOrganizations,
    )
    handleSelectInputFilter([URL_PARAMS.PROJECT, URL_PARAMS.PROJECTS], setSelectedProjects)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_AFTER, setSampleDateAfter)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_BEFORE, setSampleDateBefore, true)
    handleMethodDataSharingFilter()
    setFollowScreen()
    setShowProjectsWithNoData()
    setShowYourProjectsOnly()
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
        queryParams.delete(URL_PARAMS.SAMPLE_EVENT_ID)
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

  const userIsMemberOfProjectByProjectName = useCallback(
    (projectName, mermaidUserData) =>
      mermaidUserData?.projects?.some((project) => project.name === projectName),
    [],
  )

  const isAnyActiveFilters = useCallback(() => {
    const anyActiveCountries = selectedCountries.length
    const anyActiveOrganizations = selectedOrganizations.length
    const anyActiveProjects = selectedProjects.length
    const anyActiveSampleDateAfter = sampleDateAfter
    const anyActiveSampleDateBefore = sampleDateBefore
    const showYourDataOnly = showYourData
    const anyInactiveMethodDataSharing = omittedMethodDataSharingFilters.length > 0
    const followScreenEnabled = enableFollowScreen

    return Boolean(
      anyActiveCountries ||
        anyActiveOrganizations ||
        anyActiveSampleDateAfter ||
        anyActiveSampleDateBefore ||
        showYourDataOnly ||
        anyInactiveMethodDataSharing ||
        anyActiveProjects ||
        followScreenEnabled ||
        !showProjectsWithNoRecords,
    )
  }, [
    selectedCountries,
    selectedOrganizations,
    selectedProjects,
    sampleDateAfter,
    sampleDateBefore,
    showYourData,
    omittedMethodDataSharingFilters,
    enableFollowScreen,
    showProjectsWithNoRecords,
  ])

  const isRecordWithinMapBounds = useCallback((record, mapBbox) => {
    const isWithinLatitude =
      record.latitude >= mapBbox['_sw']?.lat && record.latitude <= mapBbox['_ne']?.lat

    const normalizeLng = (lng) => {
      // Use modulo to handle any number of rotations around the globe
      lng = (lng + 180) % 360
      // Adjust the result to be in the range [-180, 180)
      if (lng < 0) {
        lng += 360
      }

      return lng - 180
    }

    const swLng = normalizeLng(mapBbox['_sw']?.lng)
    const neLng = normalizeLng(mapBbox['_ne']?.lng)

    const isWithinLongitude =
      swLng <= neLng
        ? record.longitude >= swLng && record.longitude <= neLng
        : record.longitude >= swLng || record.longitude <= neLng

    return isWithinLatitude && isWithinLongitude
  }, [])

  const noDataProjects = useMemo(
    () =>
      projectData.results
        ?.filter(({ records }) => records.length === 0)
        .map(({ project_id }) => project_id) || [],
    [projectData.results],
  )

  const applyFilterToProjects = useCallback(
    (selectedCountries, selectedOrganizations, selectedProjects) => {
      const fallbackSampleDateAfter = new Date('1970-01-01')
      const fallbackSampleDateBefore = new Date(Date.now())

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

          const matchesSelectedProjects =
            selectedProjects.length === 0 || selectedProjects.includes(project.project_name)

          // Filter out projects that the user is not a member of
          const onlyShowProjectsUserIsAMemberOf = showYourData
            ? userIsMemberOfProject(project.project_id, mermaidUserData)
            : true

          const isProjectVisible =
            matchesSelectedCountries &&
            matchesSelectedOrganizations &&
            matchesSelectedProjects &&
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
          const allDataSharingOptions = Object.values(COLLECTION_METHODS).flatMap(
            (method) => method.dataSharingOptions,
          )

          const selectedMethodFilters = allDataSharingOptions.filter(
            (option) => !omittedMethodDataSharingFilters.includes(option),
          )

          const filteredRecords = project.records.filter((record) => {
            const recordHasSampleUnitAndPolicyMatch = selectedMethodFilters.some((filter) => {
              const { policy, value, name } = POLICY_MAPPINGS[filter] || {}
              const sampleUnitExists = record.protocols[name]?.sample_unit_count !== undefined
              const isPolicyValueMatch = record[policy] === value
              return sampleUnitExists && isPolicyValueMatch
            })

            return recordHasSampleUnitAndPolicyMatch
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
      omittedMethodDataSharingFilters,
      sampleDateAfter,
      sampleDateBefore,
      showYourData,
      showProjectsWithNoRecords,
      enableFollowScreen,
      isRecordWithinMapBounds,
      mapBbox,
      noDataProjects,
    ],
  )

  const _filterProjectRecords = useEffect(() => {
    if (!projectData.results) {
      return
    }

    const filteredProjects = applyFilterToProjects(
      selectedCountries,
      selectedOrganizations,
      selectedProjects,
    )
    const paramsSampleEventId =
      queryParams.has(URL_PARAMS.SAMPLE_EVENT_ID) && queryParams.get(URL_PARAMS.SAMPLE_EVENT_ID)
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
    sampleDateAfter,
    sampleDateBefore,
    omittedMethodDataSharingFilters,
    doesSelectedSampleEventPassFilters,
    setDisplayedProjects,
    showYourData,
    applyFilterToProjects,
    queryParams,
    enableFollowScreen,
    mapBbox,
    selectedProjects,
  ])

  const countriesSelectOnOpen = () => {
    const filteredProjects = applyFilterToProjects([], selectedOrganizations, selectedProjects)
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
    const filteredProjects = applyFilterToProjects(selectedCountries, [], selectedProjects)
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

  const projectsSelectOnOpen = () => {
    const filteredProjects = applyFilterToProjects(selectedCountries, selectedOrganizations, [])
    const filteredProjectNames = filteredProjects.map(({ project_name }) => project_name)
    const remainingProjectNames = projectData.results
      .filter(({ project_name }) => !filteredProjectNames.includes(project_name))
      .map(({ project_name }) => project_name)
    setDisplayedProjectNames(filteredProjectNames)
    setRemainingDisplayedProjectNames(remainingProjectNames)
  }

  const _removeSampleIdParamsIfDoesntPassFilters = useEffect(() => {
    if (!allProjectsFinishedFiltering) {
      return
    }
    const paramsSampleEventId =
      queryParams.has(URL_PARAMS.SAMPLE_EVENT_ID) && queryParams.get(URL_PARAMS.SAMPLE_EVENT_ID)
    doesSelectedSampleEventPassFilters(paramsSampleEventId, displayedProjects)
  }, [
    allProjectsFinishedFiltering,
    displayedProjects,
    queryParams,
    doesSelectedSampleEventPassFilters,
  ])

  const handleSelectedCountriesChange = (selectedCountries) => {
    updateSelectInputQueryParams(
      selectedCountries,
      URL_PARAMS.COUNTRY,
      URL_PARAMS.COUNTRIES,
      setSelectedCountries,
    )
  }

  const handleSelectedOrganizationsChange = (selectedOrganizations) => {
    updateSelectInputQueryParams(
      selectedOrganizations,
      URL_PARAMS.ORGANIZATION,
      URL_PARAMS.ORGANIZATIONS,
      setSelectedOrganizations,
    )
  }

  const handleSelectedProjectChange = (selectedProjects) => {
    updateSelectInputQueryParams(
      selectedProjects,
      URL_PARAMS.PROJECT,
      URL_PARAMS.PROJECTS,
      setSelectedProjects,
    )
  }

  const handleDeleteCountry = (countryToBeDeleted) => {
    const updatedCountries = selectedCountries.filter((country) => country !== countryToBeDeleted)

    updateSelectInputQueryParams(
      updatedCountries,
      URL_PARAMS.COUNTRY,
      URL_PARAMS.COUNTRIES,
      setSelectedCountries,
    )
  }

  const handleDeleteOrganization = (organizationToBeDeleted) => {
    const updatedOrganizations = selectedOrganizations.filter(
      (organization) => organization !== organizationToBeDeleted,
    )

    updateSelectInputQueryParams(
      updatedOrganizations,
      URL_PARAMS.ORGANIZATION,
      URL_PARAMS.ORGANIZATIONS,
      setSelectedOrganizations,
    )
  }

  const handleDeleteProject = (projectToBeDeleted) => {
    const updatedProjects = selectedProjects.filter((project) => project !== projectToBeDeleted)

    updateSelectInputQueryParams(
      updatedProjects,
      URL_PARAMS.PROJECT,
      URL_PARAMS.PROJECTS,
      setSelectedProjects,
    )
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
    let updatedFilter = [...omittedMethodDataSharingFilters]
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
      queryParams.delete(URL_PARAMS.OMITTED_METHOD_DATA_SHARING)
    } else {
      queryParams.set(URL_PARAMS.OMITTED_METHOD_DATA_SHARING, updatedFilter)
    }
    updateURLParams(queryParams)
    setOmittedMethodDataSharingFilters(updatedFilter)
  }

  const clearAllFilters = () => {
    const queryParams = getURLParams()
    Object.values(URL_PARAMS).forEach((value) => {
      queryParams.delete(value)
    })
    updateURLParams(queryParams)
    setSelectedCountries([])
    setSelectedOrganizations([])
    setSelectedProjects([])
    setSampleDateAfter(null)
    setSampleDateBefore(null)
    setOmittedMethodDataSharingFilters([])
    setShowYourData(false)
    setEnableFollowScreen(false)
    setShowProjectsWithNoRecords(true)
    updateURLParams(queryParams)
  }

  const handleYourDataFilter = () => {
    setShowYourData((prevState) => !prevState)

    const newState = !showYourData
    const queryParams = getURLParams()

    if (newState) {
      queryParams.set(URL_PARAMS.YOUR_PROJECTS_ONLY, 'true')
    } else {
      queryParams.delete(URL_PARAMS.YOUR_PROJECTS_ONLY)
    }

    updateURLParams(queryParams)
  }

  const getActiveProjectCount = () => {
    return displayedProjects?.length ?? 0
  }

  const updateCurrentSampleEvent = useCallback(
    (sampleEventId) => {
      const newQueryParams = new URLSearchParams(location.search)
      newQueryParams.set(URL_PARAMS.SAMPLE_EVENT_ID, sampleEventId)
      updateURLParams(newQueryParams)
      setSelectedMarkerId(sampleEventId)
    },
    [location.search, updateURLParams],
  )

  return (
    <FilterProjectsContext.Provider
      value={{
        allProjectsFinishedFiltering,
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
        handleSelectedCountriesChange,
        handleSelectedOrganizationsChange,
        handleYourDataFilter,
        isAnyActiveFilters,
        mermaidUserData,
        omittedMethodDataSharingFilters,
        organizationsSelectOnOpen,
        projectData,
        projectDataCount: projectData?.count ?? 0,
        remainingDisplayedCountries,
        sampleDateAfter,
        sampleDateBefore,
        selectedCountries,
        selectedMarkerId,
        selectedOrganizations,
        selectedProject,
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
        projectsSelectOnOpen,
        remainingDisplayedProjectNames,
        handleSelectedProjectChange,
        selectedProjects,
        setSelectedProjects,
        displayedProjectNames,
        userIsMemberOfProjectByProjectName,
        handleDeleteCountry,
        handleDeleteOrganization,
        handleDeleteProject,
      }}
    >
      {children}
    </FilterProjectsContext.Provider>
  )
}

FilterProjectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
