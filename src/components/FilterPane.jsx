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
import { filterPane } from '../constants/language'
import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconClose, IconUser } from './icons'
import theme from '../theme'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'
import { css } from 'styled-components'
import { useFilterProjectsContext } from '../context/FilterProjectsContext'

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
  min-width: 35rem;
  ${mediaQueryTabletLandscapeOnly(css`
    min-width: 80vw;
    min-height: 85dvh;
  `)}
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

export default function FilterPane({ mermaidUserData }) {
  const [countries, setCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    projectData,
    displayedProjects,
    selectedCountries,
    setSelectedCountries,
    selectedOrganizations,
    setSelectedOrganizations,
    sampleDateAfter,
    sampleDateBefore,
    dataSharingFilter,
    methodFilters,
    projectNameFilter,
    checkedProjects,
    setCheckedProjects,
    handleSelectedCountriesChange,
    handleSelectedOrganizationsChange,
    formattedDate,
    handleChangeSampleDateAfter,
    handleChangeSampleDateBefore,
    handleDataSharingFilter,
    handleMethodFilter,
    handleProjectNameFilter,
  } = useFilterProjectsContext()

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

  const getURLParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const handleClearSampleDateAfter = () => {
    handleChangeSampleDateAfter('')
  }

  const handleClearSampleDateBefore = () => {
    handleChangeSampleDateBefore('')
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

  const userIsMemberOfProject = (projectId) => {
    const projectsUserIsMemberOf = mermaidUserData?.projects?.map((project) => project.id) || []
    return projectsUserIsMemberOf.includes(projectId)
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
          {displayedProjects.length}/{projectData.count}
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
                  {userIsMemberOfProject(project.project_id) && <IconUser />}
                </label>
              </li>
            )
          })}
        </StyledUnorderedList>
      </StyledProjectListContainer>
    </StyledFilterPaneContainer>
  )
}

FilterPane.propTypes = {
  mermaidUserData: PropTypes.object,
}
