import {
  FormControl,
  MenuItem,
  Select,
  Box,
  OutlinedInput,
  Chip,
  TextField,
  IconButton,
} from '@mui/material'
import dayjs from 'dayjs'
import { filterPane } from '../constants/language'
import PropTypes from 'prop-types'
import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconClose, IconUser } from './icons'
import theme from '../theme'
import { useAuth0 } from '@auth0/auth0-react'

const URL_PARAMS = {
  COUNTRIES: 'countries',
  ORGANIZATIONS: 'organizations',
  SAMPLE_DATE_AFTER: 'sample_date_after',
  SAMPLE_DATE_BEFORE: 'sample_date_before',
  PROJECTS: 'projects',
  DATA_SHARING: 'dataSharing',
  METHODS: 'methods',
}

const collectionMethods = [
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

const deleteIconSize = {
  height: '15px',
  width: '15px',
}

const selectCustomStyles = {
  '&.MuiInputBase-root': {
    minHeight: '3.5rem',
  },
  '& .MuiSelect-select': {
    paddingRight: '1rem',
    paddingLeft: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
  MenuProps: {
    PaperProps: {
      sx: {
        maxHeight: '50vh',
      },
    },
  },
}

const selectBoxCustomStyles = { display: 'flex', flexWrap: 'wrap', gap: 0.5 }

const StyledHeader = styled('h2')`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
`

const StyledProjectsHeader = styled(StyledHeader)`
  display: flex;
  justify-content: space-between;
`

const StyledFilterPaneContainer = styled('div')`
  padding: 1rem;
`

const StyledFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    width: 100%;
  }
`

const StyledOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    background-color: ${theme.color.white};
  }
  .MuiChip-label {
    font-size: ${theme.typography.smallFontSize};
  }
`

const StyledChip = styled(Chip)`
  &.MuiChip-root {
    border-radius: 0.5rem;
    border: 0.5px solid ${theme.color.black};
    font-size: ${theme.typography.defaultFontSize};
  }
`

const StyledExpandFilters = styled('button')`
  margin: 1.5rem 0;
  cursor: pointer;
  text-decoration: underline;
  border: none;
  background: none;
  padding: 0;
`

const ShowMoreFiltersContainer = styled('div')`
  border-left: 0.5rem solid ${theme.color.grey4};
  padding-left: 0.8rem;
`

const StyledProjectNameFilter = styled(TextField)`
  width: 100%;
  background-color: ${theme.color.white};
  fieldset {
    border-radius: 0;
  }
  input {
    padding: 0.5rem 0 0.5rem 1rem;
    font-size: ${theme.typography.defaultFontSize};
  }
  & input::placeholder {
    font-style: italic;
  }
  &.MuiFormControl-root {
    border: 1px solid ${theme.color.grey0};
    border-bottom: none;
  }
`

const StyledProjectListContainer = styled('div')`
  background-color: ${theme.color.white};
  border: 1px solid ${theme.color.grey0};
  word-break: break-word;
  overflow-wrap: break-word;
`

const StyledShowOtherProjects = styled('span')`
  margin: 1.5rem 0;
  cursor: pointer;
  text-decoration: underline;
`

const StyledUnorderedList = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const StyledDateInput = styled.div`
  position: relative;
  width: calc(50% - 0.3rem);
  margin-bottom: 1rem;
  margin-right: 0.3rem;
  input {
    width: 100%;
    padding: 0.5rem;
    background-color: ${theme.color.white};
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .clear-button {
    position: absolute;
    right: 1.8rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
  }
`

const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-size: ${theme.typography.defaultFontSize};
  }
`

export default function FilterPane({
  projectData,
  displayedProjects,
  setDisplayedProjects,
  hiddenProjects,
  setHiddenProjects,
  setSelectedMarkerId,
}) {
  const [countries, setCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [sampleDateAfter, setSampleDateAfter] = useState('')
  const [sampleDateBefore, setSampleDateBefore] = useState('')
  const [dataSharingFilter, setDataSharingFilter] = useState(false)
  const [methodFilters, setMethodFilters] = useState([])
  const [showOtherProjects, setShowOtherProjects] = useState(false)
  const [checkedProjects, setCheckedProjects] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth0()

  const _generateCountryandOrganizationList = useEffect(() => {
    if (!projectData.results?.length) {
      return
    }
    const uniqueCountries = [
      ...new Set(
        projectData.results
          .map((project) => project.records[0]?.country_name)
          .filter((country) => country !== undefined)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ]
    setCountries(uniqueCountries)

    const uniqueOrganizations = [
      ...new Set(
        projectData.results
          .map((project) => {
            return project.records[0]?.tags?.map((tag) => tag.name)
          })
          .filter((tag) => tag !== undefined)
          .flat()
          .sort((a, b) => a.localeCompare(b)),
      ),
    ]

    setOrganizations(uniqueOrganizations)
  }, [projectData.results])

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

        return (
          matchesSelectedCountries &&
          matchesSelectedOrganizations &&
          matchesProjectName &&
          nonEmptyRecords
        )
      })

    const filteredIds = new Set(filteredProjects.map((project) => project.project_id))
    const queryParams = new URLSearchParams(location.search)
    const paramsSampleEventId =
      queryParams.has('sample_event_id') && queryParams.get('sample_event_id')

    doesSelectedSampleEventPassFilters(paramsSampleEventId, filteredProjects)

    const leftoverProjects = projectData.results
      .filter((project) => !filteredIds.has(project.project_id))
      .sort((a, b) => a.records[0]?.project_name.localeCompare(b.records[0]?.project_name))

    setHiddenProjects(leftoverProjects)
    setDisplayedProjects(
      filteredProjects.sort((a, b) =>
        a.records[0]?.project_name.localeCompare(b.records[0]?.project_name),
      ),
    )
    setCheckedProjects([...filteredIds])
  }, [
    projectData.results,
    selectedCountries,
    selectedOrganizations,
    projectNameFilter,
    sampleDateAfter,
    sampleDateBefore,
    dataSharingFilter,
    methodFilters,
    setHiddenProjects,
    setDisplayedProjects,
  ])

  function doesSelectedSampleEventPassFilters(sampleEventId, filteredProjects) {
    const queryParams = getURLParams()
    let displaySelectedSampleEvent = false
    filteredProjects.forEach((project) => {
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
  }

  const getURLParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const formatEndDate = (date) => {
    return dayjs(date).set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999)
  }

  const _getUrlParams = useEffect(() => {
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
          return collectionMethods.some((collectionMethod) => collectionMethod.name === method)
        })
        setMethodFilters(validMethods)
        if (validMethods.length === 0) {
          queryParams.delete('method')
          queryParams.delete(URL_PARAMS.METHODS)
        } else {
          queryParams.set(URL_PARAMS.METHODS, validMethods)
        }
        updateURLParams(queryParams)
      }
    }

    const handleProjectNameFilter = () => {
      if (queryParams.has(URL_PARAMS.PROJECTS)) {
        setProjectNameFilter(queryParams.get(URL_PARAMS.PROJECTS))
      } else if (queryParams.has('project')) {
        setProjectNameFilter(queryParams.get('project'))
      }
    }

    const handleDataSharingFilter = () => {
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
    handleProjectNameFilter()
    handleDataSharingFilter()
  }, [getURLParams, updateURLParams])

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

  const formattedDate = (date) => {
    return !date ? '' : dayjs(date).format('YYYY-MM-DD')
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

  const handleClearSampleDateAfter = () => {
    handleChangeSampleDateAfter('')
  }

  const handleClearSampleDateBefore = () => {
    handleChangeSampleDateBefore('')
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

  const handleDeleteCountry = (country) => {
    const updatedCountries = selectedCountries.filter(
      (selectedCountry) => selectedCountry !== country,
    )
    setSelectedCountries(updatedCountries)
    const queryParams = getURLParams()
    if (updatedCountries.length === 0) {
      queryParams.delete('country')
      queryParams.delete(URL_PARAMS.COUNTRIES)
    } else {
      queryParams.set(URL_PARAMS.COUNTRIES, updatedCountries)
    }
    updateURLParams(queryParams)
  }

  const handleDeleteOrganization = (organization) => {
    const updatedOrganizations = selectedOrganizations.filter(
      (selectedOrganization) => selectedOrganization !== organization,
    )
    setSelectedOrganizations(updatedOrganizations)
    const queryParams = getURLParams()
    if (updatedOrganizations.length === 0) {
      queryParams.delete('organization')
      queryParams.delete(URL_PARAMS.ORGANIZATIONS)
    } else {
      queryParams.set(URL_PARAMS.ORGANIZATIONS, updatedOrganizations)
    }
    updateURLParams(queryParams)
  }

  const handleCheckProject = (projectId) => {
    const updatedCheckedProjects = checkedProjects.includes(projectId)
      ? checkedProjects.filter((checkedProject) => checkedProject !== projectId)
      : [...checkedProjects, projectId]
    setCheckedProjects(updatedCheckedProjects)
  }

  const userIsAdminOfProject = (userName, project) => {
    if (!userName) {
      return false
    }

    const projectAdmins = project.records[0]?.project_admins.map((admin) => admin.name)
    return projectAdmins.includes(userName)
  }

  return (
    <StyledFilterPaneContainer>
      <StyledHeader>Countries</StyledHeader>
      <StyledFormControl>
        <Select
          multiple
          value={selectedCountries}
          onChange={handleSelectedCountriesChange}
          input={<StyledOutlinedInput />}
          sx={selectCustomStyles}
          MenuProps={selectCustomStyles.MenuProps}
          renderValue={(selected) => (
            <Box sx={selectBoxCustomStyles}>
              {selected.map((value) => (
                <StyledChip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteCountry(value)}
                  deleteIcon={
                    <IconClose
                      onMouseDown={(event) => event.stopPropagation()}
                      {...deleteIconSize}
                    />
                  }
                />
              ))}
            </Box>
          )}
        >
          {countries.map((country) => (
            <StyledMenuItem key={country} value={country}>
              <input type="checkbox" checked={selectedCountries.includes(country)} readOnly />
              {country}
            </StyledMenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <StyledHeader>Organizations</StyledHeader>
      <StyledFormControl>
        <Select
          multiple
          value={selectedOrganizations}
          onChange={handleSelectedOrganizationsChange}
          input={<StyledOutlinedInput />}
          sx={selectCustomStyles}
          MenuProps={selectCustomStyles.MenuProps}
          renderValue={(selected) => (
            <Box sx={selectBoxCustomStyles}>
              {selected.map((value) => (
                <StyledChip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteOrganization(value)}
                  deleteIcon={
                    <IconClose
                      onMouseDown={(event) => event.stopPropagation()}
                      {...deleteIconSize}
                    />
                  }
                />
              ))}
            </Box>
          )}
        >
          {organizations.map((organization) => (
            <StyledMenuItem key={organization} value={organization}>
              <input
                type="checkbox"
                checked={selectedOrganizations.includes(organization)}
                readOnly
              />
              {organization}
            </StyledMenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <StyledExpandFilters onClick={() => setShowMoreFilters(!showMoreFilters)}>
        Show {showMoreFilters ? 'fewer' : 'more'} filters
      </StyledExpandFilters>
      {showMoreFilters ? (
        <ShowMoreFiltersContainer>
          <StyledHeader>Date Range</StyledHeader>
          <StyledDateInput>
            <input
              type="date"
              value={formattedDate(sampleDateAfter)}
              onChange={(e) => handleChangeSampleDateAfter(e.target.value)}
            />
            {sampleDateAfter && (
              <IconButton
                aria-label="clear date"
                onClick={handleClearSampleDateAfter}
                className="clear-button"
              >
                <IconClose />
              </IconButton>
            )}
          </StyledDateInput>

          <StyledDateInput>
            <input
              type="date"
              value={formattedDate(sampleDateBefore)}
              onChange={(e) => handleChangeSampleDateBefore(e.target.value)}
            />
            {sampleDateBefore && (
              <IconButton
                aria-label="clear date"
                onClick={handleClearSampleDateBefore}
                className="clear-button"
              >
                <IconClose />
              </IconButton>
            )}
          </StyledDateInput>
          <StyledHeader>Data sharing</StyledHeader>
          <div>
            <input
              type="checkbox"
              name="dataSharing"
              id="dataSharing"
              onChange={handleDataSharingFilter}
              checked={dataSharingFilter}
            />
            <label htmlFor="dataSharing">{filterPane.dataSharing}</label>
          </div>
          <StyledHeader>Methods</StyledHeader>
          <StyledUnorderedList>
            {collectionMethods.map((method) => (
              <li key={method.name}>
                <input
                  id={method.name}
                  type="checkbox"
                  name={method.name}
                  onChange={handleMethodFilter}
                  checked={methodFilters.includes(method.name)}
                />
                <label htmlFor={method.name}>{method.description}</label>
              </li>
            ))}
          </StyledUnorderedList>
        </ShowMoreFiltersContainer>
      ) : null}
      <StyledProjectsHeader>
        <span>Projects</span>
        <span>
          {displayedProjects.length}/{projectData.results?.length}
        </span>
      </StyledProjectsHeader>
      <StyledProjectNameFilter
        value={projectNameFilter}
        placeholder="Type to filter projects"
        onChange={handleProjectNameFilter}
      />
      <StyledProjectListContainer>
        <StyledUnorderedList>
          {displayedProjects.map((project) => {
            return (
              <li key={project.project_id}>
                <input
                  id={`checkbox-${project.project_id}`}
                  type="checkbox"
                  checked={checkedProjects.includes(project.project_id)}
                  onChange={() => handleCheckProject(project.project_id)}
                />{' '}
                <label htmlFor={`checkbox-${project.project_id}`}>
                  {project.records[0]?.project_name}{' '}
                  {userIsAdminOfProject(user?.name, project) && <IconUser />}
                </label>
              </li>
            )
          })}
        </StyledUnorderedList>
      </StyledProjectListContainer>
      <StyledProjectsHeader>
        <span>Other projects </span>
        <div>
          <StyledShowOtherProjects onClick={() => setShowOtherProjects(!showOtherProjects)}>
            {showOtherProjects ? 'Hide' : 'Show'}
          </StyledShowOtherProjects>{' '}
          {hiddenProjects.length}/{projectData.results?.length}
        </div>
      </StyledProjectsHeader>
      {showOtherProjects ? (
        <StyledProjectListContainer>
          {hiddenProjects.map((project, index) => {
            return project.records[0]?.project_name ? (
              <div key={project.project_id}>
                {index}: {project.records[0]?.project_name}
              </div>
            ) : (
              <div key={project.project_id}>{index}: Project with no name</div>
            )
          })}
        </StyledProjectListContainer>
      ) : null}
    </StyledFilterPaneContainer>
  )
}

FilterPane.propTypes = {
  projectData: PropTypes.object.isRequired,
  displayedProjects: PropTypes.array.isRequired,
  setDisplayedProjects: PropTypes.func.isRequired,
  hiddenProjects: PropTypes.array.isRequired,
  setHiddenProjects: PropTypes.func.isRequired,
}
