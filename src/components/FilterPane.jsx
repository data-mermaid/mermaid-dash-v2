import {
  FormControl,
  MenuItem,
  Select,
  Box,
  OutlinedInput,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { filterPane } from '../constants/language'

import PropTypes from 'prop-types'
import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconClose } from './icons'
import theme from '../theme'

const URL_PARAMS = {
  COUNTRIES: 'countries',
  ORGANIZATIONS: 'organizations',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  PROJECT_NAME: 'projectName',
  DATA_SHARING: 'dataSharing',
  METHOD: 'method',
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

const StyledHeader = styled('h1')`
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
`

const StyledChip = styled(Chip)`
  &.MuiChip-root {
    border-radius: 0.5rem;
    border: 0.5px solid ${theme.color.black};
    text-transform: uppercase;
  }
`

const StyledExpandFilters = styled('div')`
  margin: 1.5rem 0;
  cursor: pointer;
  text-decoration: underline;
`

const ShowMoreFiltersContainer = styled('div')`
  border-left: 0.5rem solid ${theme.color.grey4};
  padding-left: 0.8rem;
`

const StyledDatePicker = styled(DatePicker)`
  width: calc(50% - 0.3rem);
  background-color: ${theme.color.white};
  &.MuiFormControl-root {
    margin-bottom: 1rem;
    margin-right: 0.3rem;
  }
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

export default function FilterPane(props) {
  const {
    projectData,
    displayedProjects,
    setDisplayedProjects,
    hiddenProjects,
    setHiddenProjects,
  } = props
  const [countries, setCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dataSharingFilter, setDataSharingFilter] = useState(false)
  const [methodFilters, setMethodFilters] = useState([])
  const [showOtherProjects, setShowOtherProjects] = useState(false)
  const [checkedProjects, setCheckedProjects] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
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

  useEffect(() => {
    if (!projectData.results) {
      return
    }

    const fallbackStartDate = new Date('1970-01-01')
    const fallbackEndDate = new Date(Date.now())

    const filteredProjects = projectData.results
      .map((project) => {
        // Filter project if sample date falls within selected date range
        if (!startDate && !endDate) {
          return project
        }
        const beginDate = startDate || fallbackStartDate
        const finishDate = endDate || fallbackEndDate
        return {
          ...project,
          records: project.records.filter((record) => {
            const recordDate = new Date(record.sample_date)
            return recordDate <= finishDate && recordDate >= beginDate
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
    startDate,
    endDate,
    dataSharingFilter,
    methodFilters,
    setHiddenProjects,
    setDisplayedProjects,
  ])

  const getURLParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  useEffect(() => {
    const queryParams = getURLParams()
    if (queryParams.has(URL_PARAMS.COUNTRIES)) {
      setSelectedCountries(queryParams.getAll(URL_PARAMS.COUNTRIES)[0].split(','))
    }
    if (queryParams.has(URL_PARAMS.ORGANIZATIONS)) {
      setSelectedOrganizations(queryParams.getAll(URL_PARAMS.ORGANIZATIONS)[0].split(','))
    }
    if (queryParams.has(URL_PARAMS.START_DATE)) {
      const queryParamsStartDate = queryParams.get(URL_PARAMS.START_DATE)
      if (isValidDateFormat(queryParamsStartDate)) {
        setStartDate(dayjs(queryParamsStartDate))
      } else {
        queryParams.delete(URL_PARAMS.START_DATE)
        updateURLParams(queryParams)
      }
    }
    if (queryParams.has(URL_PARAMS.END_DATE)) {
      const queryParamsEndDate = queryParams.get(URL_PARAMS.END_DATE)
      if (!isValidDateFormat(queryParamsEndDate)) {
        queryParams.delete(URL_PARAMS.END_DATE)
        updateURLParams(queryParams)
        return
      }
      const endDate = dayjs(queryParamsEndDate)
        .set('hour', 23)
        .set('minute', 59)
        .set('second', 59)
        .set('millisecond', 999)
      setEndDate(endDate)
    }
    if (queryParams.has(URL_PARAMS.PROJECT_NAME)) {
      setProjectNameFilter(queryParams.get(URL_PARAMS.PROJECT_NAME))
    }
    if (queryParams.has(URL_PARAMS.DATA_SHARING)) {
      if (queryParams.get(URL_PARAMS.DATA_SHARING) === 'true') {
        setDataSharingFilter(true)
      } else {
        queryParams.delete(URL_PARAMS.DATA_SHARING)
        updateURLParams(queryParams)
      }
    }
    if (queryParams.has(URL_PARAMS.METHOD)) {
      const queryParamsMethods = queryParams.getAll(URL_PARAMS.METHOD)[0].split(',')
      const validMethods = queryParamsMethods.filter((method) => {
        return collectionMethods.some((collectionMethod) => collectionMethod.name === method)
      })
      setMethodFilters(validMethods)
      if (validMethods.length === 0) {
        queryParams.delete(URL_PARAMS.METHOD)
      } else {
        queryParams.set(URL_PARAMS.METHOD, validMethods)
      }
      updateURLParams(queryParams)
    }
  }, [getURLParams, updateURLParams])

  const handleSelectedCountriesChange = (event) => {
    const queryParams = getURLParams()
    const selectedCountries = event.target.value
    if (selectedCountries.length === 0) {
      queryParams.delete(URL_PARAMS.COUNTRIES)
    } else {
      queryParams.set(URL_PARAMS.COUNTRIES, selectedCountries)
    }
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
    updateURLParams(queryParams)
    setSelectedOrganizations(selectedOrganizations)
  }

  const handleProjectNameFilter = (event) => {
    const queryParams = getURLParams()
    const projectName = event.target.value
    if (projectName.length === 0) {
      queryParams.delete(URL_PARAMS.PROJECT_NAME)
    } else {
      queryParams.set(URL_PARAMS.PROJECT_NAME, projectName)
    }
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
    return dayjs(date).format('YYYY-MM-DD')
  }

  const handleChangeStartDate = (startDate) => {
    const queryParams = getURLParams()
    if (startDate === null) {
      queryParams.delete(URL_PARAMS.START_DATE)
    } else {
      const formattedStartDate = formattedDate(new Date(startDate))
      queryParams.set(URL_PARAMS.START_DATE, formattedStartDate)
    }
    updateURLParams(queryParams)
    setStartDate(startDate)
  }

  const handleChangeEndDate = (endDate) => {
    const queryParams = getURLParams()
    if (endDate === null) {
      queryParams.delete(URL_PARAMS.END_DATE)
    } else {
      const formattedEndDate = formattedDate(endDate)
      queryParams.set(URL_PARAMS.END_DATE, formattedEndDate)
    }
    updateURLParams(queryParams)
    setEndDate(endDate)
  }

  const handleClearStartDate = () => {
    handleChangeStartDate(null)
  }

  const handleClearEndDate = () => {
    handleChangeEndDate(null)
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
      queryParams.delete(URL_PARAMS.METHOD)
    } else {
      queryParams.set(URL_PARAMS.METHOD, updatedMethodFilters)
    }
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

  return (
    <StyledFilterPaneContainer>
      <StyledHeader>Countries</StyledHeader>
      <StyledFormControl>
        <Select
          multiple
          value={selectedCountries}
          onChange={handleSelectedCountriesChange}
          input={<StyledOutlinedInput />}
          sx={{
            '&.MuiInputBase-root': {
              minHeight: '3.5rem',
            },
            '& .MuiSelect-select': {
              paddingRight: '1rem',
              paddingLeft: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            },
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
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
          sx={{
            '&.MuiInputBase-root': {
              minHeight: '3.5rem',
            },
            '& .MuiSelect-select': {
              paddingRight: '1rem',
              paddingLeft: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            },
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
            <MenuItem key={organization} value={organization}>
              {organization}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <StyledExpandFilters onClick={() => setShowMoreFilters(!showMoreFilters)}>
        Show {showMoreFilters ? 'fewer' : 'more'} filters
      </StyledExpandFilters>
      {showMoreFilters ? (
        <ShowMoreFiltersContainer>
          <StyledHeader>Date Range</StyledHeader>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledDatePicker
              label="From"
              value={startDate}
              onChange={handleChangeStartDate}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment>
                        <IconButton aria-label="clear date" onClick={handleClearStartDate}>
                          <IconClose />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
            <StyledDatePicker
              label="To"
              value={endDate}
              onChange={handleChangeEndDate}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment>
                        <IconButton aria-label="clear date" onClick={handleClearEndDate}>
                          <IconClose />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </LocalizationProvider>
          <StyledHeader>Data sharing</StyledHeader>
          <div>
            <input
              type="checkbox"
              name="dataSharing"
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
                  type="checkbox"
                  checked={checkedProjects.includes(project.project_id)}
                  onChange={() => handleCheckProject(project.project_id)}
                />{' '}
                {project.records[0]?.project_name}
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
