import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  OutlinedInput,
  Chip,
  TextField,
} from '@mui/material'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

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

export default function FilterPane(props) {
  const { projectData } = props
  const [countries, setCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [projectNameFilter, setProjectNameFilter] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [hiddenProjects, setHiddenProjects] = useState([])
  const [dataSharingFilter, setDataSharingFilter] = useState(false)
  const [methodFilters, setMethodFilters] = useState([])

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
              methodFilters.every((method) => Object.keys(record.protocols).includes(method)),
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
  }, [
    projectData.results,
    selectedCountries,
    selectedOrganizations,
    projectNameFilter,
    startDate,
    endDate,
    dataSharingFilter,
    methodFilters,
  ])

  const getURLParams = () => {
    return new URLSearchParams(window.location.search)
  }

  useEffect(() => {
    const queryParams = getURLParams()
    if (queryParams.has('countries')) {
      setSelectedCountries(queryParams.getAll('countries')[0].split(','))
    }
    if (queryParams.has('organizations')) {
      setSelectedOrganizations(queryParams.getAll('organizations')[0].split(','))
    }
    if (queryParams.has('startDate')) {
      setStartDate(dayjs(new Date(queryParams.get('startDate'))))
    }
    if (queryParams.has('endDate')) {
      setEndDate(dayjs(new Date(queryParams.get('endDate')).setHours(59, 59, 59, 999)))
    }
    if (queryParams.has('projectName')) {
      setProjectNameFilter(queryParams.get('projectName'))
    }
    if (queryParams.has('dataSharing')) {
      setDataSharingFilter(queryParams.get('dataSharing'))
    }
    if (queryParams.has('method')) {
      setMethodFilters(queryParams.getAll('method')[0].split(','))
    }
  }, [])

  const updateURLParams = (queryParams) => {
    window.history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`)
  }

  const handleSelectedCountriesChange = (event) => {
    const queryParams = getURLParams()
    const selectedCountries = event.target.value
    if (selectedCountries.length === 0) {
      queryParams.delete('countries')
    } else {
      queryParams.set('countries', selectedCountries)
    }
    updateURLParams(queryParams)
    setSelectedCountries(selectedCountries)
  }

  const handleSelectedOrganizationsChange = (event) => {
    const queryParams = getURLParams()
    const selectedOrganizations = event.target.value
    if (selectedOrganizations.length === 0) {
      queryParams.delete('organizations')
    } else {
      queryParams.set('organizations', selectedOrganizations)
    }
    updateURLParams(queryParams)
    setSelectedOrganizations(selectedOrganizations)
  }

  const handleProjectNameFilter = (event) => {
    const queryParams = getURLParams()
    const projectName = event.target.value
    if (projectName.length === 0) {
      queryParams.delete('projectName')
    } else {
      queryParams.set('projectName', projectName)
    }
    updateURLParams(queryParams)
    setProjectNameFilter(projectName)
  }

  const handleDataSharingFilter = (event) => {
    const queryParams = getURLParams()
    const { checked } = event.target
    if (!checked) {
      queryParams.delete('dataSharing')
    } else {
      queryParams.set('dataSharing', checked)
    }
    updateURLParams(queryParams)
    setDataSharingFilter(checked)
  }

  const formattedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }

  const handleChangeStartDate = (startDate) => {
    const formattedStartDate = formattedDate(new Date(startDate))
    const queryParams = getURLParams()
    queryParams.set('startDate', formattedStartDate)
    updateURLParams(queryParams)
    setStartDate(startDate)
  }

  const handleChangeEndDate = (endDate) => {
    const formattedEndDate = formattedDate(new Date(endDate).setHours(23, 59, 59, 999))
    const queryParams = getURLParams()
    queryParams.set('endDate', formattedEndDate)
    updateURLParams(queryParams)
    setEndDate(endDate)
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
      queryParams.delete('method')
    } else {
      queryParams.set('method', updatedMethodFilters)
    }
    updateURLParams(queryParams)
    setMethodFilters(updatedMethodFilters)
  }

  return (
    <div>
      <span>Filter Pane</span>
      <div style={{ color: 'red' }}>Projects loaded: {projectData.results?.length}</div>
      <div>Countries</div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel>Countries</InputLabel>
        <Select
          multiple
          value={selectedCountries}
          onChange={handleSelectedCountriesChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
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
      </FormControl>
      <div>Organizations</div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel>Organizations</InputLabel>
        <Select
          multiple
          value={selectedOrganizations}
          onChange={handleSelectedOrganizationsChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
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
      </FormControl>
      <div>Date Range</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleChangeStartDate}
          slotProps={{ textField: {} }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleChangeEndDate}
          slotProps={{ textField: {} }}
        />
      </LocalizationProvider>
      <div>Data sharing</div>
      <div>
        <input type="checkbox" name="dataSharing" onChange={handleDataSharingFilter} />
        <label htmlFor="dataSharing">Only show data you have access to</label>
      </div>
      <div>Method</div>
      <div>
        {collectionMethods.map((method) => (
          <div key={method.name}>
            <input
              type="checkbox"
              name={method.name}
              onChange={handleMethodFilter}
              checked={methodFilters.includes(method.name)}
            />
            <label htmlFor={method.name}>{method.description}</label>
          </div>
        ))}
      </div>
      <div style={{ color: 'red' }}>
        Projects matching your criteria: {displayedProjects.length}/{projectData.results?.length}
      </div>
      <TextField value={projectNameFilter} onChange={handleProjectNameFilter} />
      {displayedProjects.map((project, index) => {
        return (
          <div key={project.project_id}>
            {index}: {project.records[0]?.project_name}
          </div>
        )
      })}
      <div>-------------</div>
      <div style={{ color: 'red' }}>Other projects: {hiddenProjects.length} projects</div>
      {hiddenProjects.map((project, index) => {
        return project.records[0]?.project_name ? (
          <div key={project.project_id}>
            {index}: {project.records[0]?.project_name}
          </div>
        ) : (
          <div key={project.project_id}>{index}: Project with no name</div>
        )
      })}
    </div>
  )
}

FilterPane.propTypes = {
  projectData: PropTypes.object.isRequired,
}
