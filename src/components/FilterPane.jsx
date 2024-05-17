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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export default function FilterPane(props) {
  const { projectData } = props

  const [countries, setCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [projectNameFilter, setProjectNameFiltere] = useState('')
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
      .filter((project) => {
        // Countries
        if (selectedCountries.length === 0) {
          return project
        } else {
          return selectedCountries.includes(project.records[0]?.country_name)
        }
      })
      .filter((project) => {
        // Organization
        if (selectedOrganizations.length === 0) {
          return project
        } else {
          for (const tag of project.records[0]?.tags ?? []) {
            if (selectedOrganizations.includes(tag.name)) {
              return true
            }
          }
        }
      })
      .filter((project) => {
        // Project name
        if (projectNameFilter === '') {
          return project
        } else {
          return project.records[0]?.project_name
            .toLowerCase()
            .includes(projectNameFilter.toLowerCase())
        }
      })
      .map((project) => {
        // Date range
        if (!startDate && !endDate) {
          return project
        }
        const beginDate = startDate || fallbackStartDate
        const finishDate = endDate || fallbackEndDate
        return {
          ...project,
          records: project.records.filter((record) => {
            const recordDate = new Date(record.sample_date)
            return recordDate < finishDate && recordDate > beginDate
          }),
        }
      })
      .map((project) => {
        // Data sharing
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
            records: project.records.filter((record) => {
              return policies.some((policy) => {
                return record[policy] === 'public summary'
              })
            }),
          }
        } else {
          return project
        }
      })
      .map((project) => {
        // Method filters
        if (methodFilters.length === 0) {
          return project
        } else {
          return {
            ...project,
            records: project.records.filter((record) => {
              return methodFilters.every((method) => {
                return Object.keys(record.protocols).includes(method)
              })
            }),
          }
        }
      })
      .filter((project) => {
        // Non empty records
        return project.records.length > 0
      })

    const filteredIds = new Set(filteredProjects.map((project) => project.project_id))
    const leftoverProjects = projectData.results.filter((project) => {
      return !filteredIds.has(project.project_id)
    })

    setHiddenProjects(leftoverProjects)
    setDisplayedProjects(filteredProjects)
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

  const handleSelectedCountriesChange = (event) => {
    setSelectedCountries(event.target.value)
  }

  const handleSelectedOrganizationsChange = (event) => {
    setSelectedOrganizations(event.target.value)
  }

  const handleProjectNameFilter = (event) => {
    setProjectNameFiltere(event.target.value)
  }

  const handleDataSharingFilter = (event) => {
    setDataSharingFilter(event.target.checked)
  }

  const handleMethodFilter = (event) => {
    if (event.target.checked) {
      setMethodFilters([...methodFilters, event.target.name])
    } else {
      setMethodFilters(methodFilters.filter((method) => method !== event.target.name))
    }
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
          onChange={(date) => setStartDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <div>Data sharing</div>
      <div>
        <input type="checkbox" name="dataSharing" onChange={handleDataSharingFilter} />
        <label htmlFor="dataSharing">Only show data you have access to</label>
      </div>
      <div>Method</div>
      <div>
        <div>
          <input type="checkbox" name="beltfish" onChange={handleMethodFilter} />
          <label htmlFor="beltfish">Fish Belt</label>
        </div>
        <div>
          <input type="checkbox" name="colonies_bleached" onChange={handleMethodFilter} />
          <label htmlFor="colonies_bleached">Bleaching</label>
        </div>
        <div>
          <input type="checkbox" name="benthicpit" onChange={handleMethodFilter} />
          <label htmlFor="benthicpit">Benthic PIT</label>
        </div>
        <div>
          <input type="checkbox" name="benthiclit" onChange={handleMethodFilter} />
          <label htmlFor="benthiclit">Benthic LIT</label>
        </div>
        <div>
          <input type="checkbox" name="quadrat_benthic_percent" onChange={handleMethodFilter} />
          <label htmlFor="quadrat_benthic_percent">Benthic Photo Quadrat</label>
        </div>
        <div>
          <input type="checkbox" name="habitatcomplexity" onChange={handleMethodFilter} />
          <label htmlFor="habitatcomplexity">Habitat Complexity</label>
        </div>
      </div>
      <div style={{ color: 'red' }}>
        Projects matching your criteria: {displayedProjects.length}/{projectData.results?.length}
      </div>
      <TextField value={projectNameFilter} onChange={handleProjectNameFilter} />
      {displayedProjects
        .sort((a, b) => a.records[0]?.project_name.localeCompare(b.records[0]?.project_name))
        .map((project, index) => {
          return (
            <div key={project.project_id}>
              {index}: {project.records[0]?.project_name}
            </div>
          )
        })}
      <div>-------------</div>
      <div style={{ color: 'red' }}>Other projects: {hiddenProjects.length} projects</div>
      {hiddenProjects
        .sort((a, b) => a.records[0]?.project_name.localeCompare(b.records[0]?.project_name))
        .map((project, index) => {
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
