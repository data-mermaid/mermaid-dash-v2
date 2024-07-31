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

const initialCollectionMethods = COLLECTION_METHODS.map((method) => method.name)

const FilterProjectsContext = createContext()

export const FilterProjectsProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [projectData, setProjectData] = useState({})
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [sampleDateAfter, setSampleDateAfter] = useState('')
  const [sampleDateBefore, setSampleDateBefore] = useState('')
  const [dataSharingFilter, setDataSharingFilter] = useState(false)
  const [methodFilters, setMethodFilters] = useState([])
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [checkedProjects, setCheckedProjects] = useState([])
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const queryParamsSampleEventId = queryParams.get('sample_event_id')
  const initialSelectedMarker = queryParamsSampleEventId !== null ? queryParamsSampleEventId : null
  const [selectedMarkerId, setSelectedMarkerId] = useState(initialSelectedMarker)
  const [showYourData, setShowYourData] = useState(false)
  const [mermaidUserData, setMermaidUserData] = useState({})
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

    const handleMethodsFilter = () => {
      if (queryParams.has(URL_PARAMS.METHODS) || queryParams.has('method')) {
        const queryParamsMethods = queryParams.has('method')
          ? queryParams.getAll('method')[0].split(',')
          : queryParams.getAll(URL_PARAMS.METHODS)[0].split(',')
        const validMethods = queryParamsMethods.filter((method) => {
          return COLLECTION_METHODS.some((collectionMethod) => collectionMethod.name === method)
        })
        setMethodFilters(validMethods)
        if (validMethods.length === 0) {
          queryParams.delete('method')
          queryParams.delete(URL_PARAMS.METHODS)
        } else {
          queryParams.set(URL_PARAMS.METHODS, validMethods)
        }
        updateURLParams(queryParams)
      } else {
        queryParams.set(URL_PARAMS.METHODS, initialCollectionMethods)
        updateURLParams(queryParams)
      }
    }

    const setProjectNameValue = () => {
      if (queryParams.has(URL_PARAMS.PROJECTS)) {
        setProjectNameFilter(queryParams.get(URL_PARAMS.PROJECTS))
      } else if (queryParams.has('project')) {
        setProjectNameFilter(queryParams.get('project'))
      }
    }

    const setDataSharingValue = () => {
      if (queryParams.has(URL_PARAMS.DATA_SHARING)) {
        if (queryParams.get(URL_PARAMS.DATA_SHARING) === 'true') {
          setDataSharingFilter(true)
        } else {
          queryParams.delete(URL_PARAMS.DATA_SHARING)
          updateURLParams(queryParams)
        }
      }
    }

    setFilterValue(URL_PARAMS.COUNTRIES, 'country', setSelectedCountries)
    setFilterValue(URL_PARAMS.ORGANIZATIONS, 'organization', setSelectedOrganizations)
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_AFTER, setSampleDateAfter, (date) =>
      formattedDate(dayjs(date)),
    )
    handleDateFilter(URL_PARAMS.SAMPLE_DATE_BEFORE, setSampleDateBefore, formatEndDate)
    handleMethodsFilter()
    setProjectNameValue()
    setDataSharingValue()
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

  const _filterProjectRecords = useEffect(() => {
    if (!projectData.results) {
      return
    }

    const fallbackSampleDateAfter = new Date('1970-01-01')
    const fallbackSampleDateBefore = new Date(Date.now())

    const filteredProjects = projectData.results
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
        // Filter projects based on data sharing policy
        if (dataSharingFilter) {
          const policies = [
            'data_policy_beltfish',
            'data_policy_benthiclit',
            'data_policy_benthicpit',
            'data_policy_benthicpqt',
            'data_policy_bleachingqc',
            'data_policy_habitatcomplexity',
          ]
          return {
            ...project,
            records: project.records.filter((record) =>
              policies.some((policy) => record[policy] === 'public summary'),
            ),
          }
        } else {
          return project
        }
      })
      .map((project) => {
        // Filter projects based on collection method
        if (methodFilters.length === 0) {
          return project
        } else {
          return {
            ...project,
            records: project.records.filter((record) =>
              methodFilters.some((method) => Object.keys(record.protocols).includes(method)),
            ),
          }
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
          project.records[0]?.project_name.toLowerCase().includes(projectNameFilter.toLowerCase())

        // Filter out projects with empty records
        const nonEmptyRecords = project.records.length > 0

        // Filter out projects that the user is not a member of
        const onlyShowProjectsUserIsAMemberOf = showYourData
          ? userIsMemberOfProject(project.project_id, mermaidUserData)
          : true

        return (
          matchesSelectedCountries &&
          matchesSelectedOrganizations &&
          matchesProjectName &&
          nonEmptyRecords &&
          onlyShowProjectsUserIsAMemberOf
        )
      })

    const filteredIds = new Set(filteredProjects.map((project) => project.project_id))

    setDisplayedProjects(
      filteredProjects.sort((a, b) =>
        a.records[0]?.project_name.localeCompare(b.records[0]?.project_name),
      ),
    )
    setCheckedProjects([...filteredIds])
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
    dataSharingFilter,
    methodFilters,
    setDisplayedProjects,
    showYourData,
    userIsMemberOfProject,
    mermaidUserData,
  ])

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

  const handleDataSharingFilter = (event) => {
    const queryParams = getURLParams()
    const { checked } = event.target
    if (!checked) {
      queryParams.delete(URL_PARAMS.DATA_SHARING)
    } else {
      queryParams.set(URL_PARAMS.DATA_SHARING, checked)
    }
    updateURLParams(queryParams)
    setDataSharingFilter(checked)
  }

  const handleMethodFilter = (event) => {
    let updatedMethodFilters
    const { checked, name } = event.target
    if (checked) {
      updatedMethodFilters = [...methodFilters, name]
    } else {
      updatedMethodFilters = methodFilters.filter((method) => method !== name)
    }

    const queryParams = getURLParams()
    if (updatedMethodFilters.length === 0) {
      queryParams.delete(URL_PARAMS.METHODS)
    } else {
      queryParams.set(URL_PARAMS.METHODS, updatedMethodFilters)
    }
    queryParams.delete('method')
    updateURLParams(queryParams)
    setMethodFilters(updatedMethodFilters)
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
    setDataSharingFilter(false)
    setMethodFilters(initialCollectionMethods)
    setProjectNameFilter('')
    setShowYourData(false)
  }

  const handleYourDataFilter = (event) => {
    const { checked } = event.target
    setShowYourData(checked)
  }

  return (
    <FilterProjectsContext.Provider
      value={{
        URL_PARAMS,
        projectData,
        setProjectData,
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
        dataSharingFilter,
        setDataSharingFilter,
        methodFilters,
        setMethodFilters,
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
        handleDataSharingFilter,
        handleMethodFilter,
        handleProjectNameFilter,
        clearAllFilters,
        handleYourDataFilter,
        userIsMemberOfProject,
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
