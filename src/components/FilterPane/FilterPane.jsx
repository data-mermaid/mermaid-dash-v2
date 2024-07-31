import PropTypes from 'prop-types'
import { Select, Box, IconButton } from '@mui/material'
import {
  StyledHeader,
  StyledProjectsHeader,
  StyledFilterPaneContainer,
  StyledFormControl,
  StyledOutlinedInput,
  StyledChip,
  StyledExpandFilters,
  ShowMoreFiltersContainer,
  StyledProjectNameFilter,
  StyledProjectListContainer,
  StyledUnorderedList,
  StyledDateInput,
  StyledMenuItem,
  ExpandClickableArea,
  StyledLabel,
} from './FilterPane.styles'
import { filterPane } from '../../constants/language'
import { URL_PARAMS, COLLECTION_METHODS } from '../../constants/constants'
import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconClose, IconUser } from '../../assets/icons'
import { useFilterProjectsContext } from '../../context/FilterProjectsContext'
import { useAuth0 } from '@auth0/auth0-react'

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

const FilterPane = ({ mermaidUserData }) => {
  const [countries, setCountries] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth0()
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
    showYourData,
    handleSelectedCountriesChange,
    handleSelectedOrganizationsChange,
    formattedDate,
    handleChangeSampleDateAfter,
    handleChangeSampleDateBefore,
    handleDataSharingFilter,
    handleMethodFilter,
    handleProjectNameFilter,
    handleYourDataFilter,
    userIsMemberOfProject,
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
          {isAuthenticated ? (
            <>
              <StyledHeader>Your Data</StyledHeader>
              <div>
                <input
                  type="checkbox"
                  name="yourData"
                  id="yourData"
                  onChange={handleYourDataFilter}
                  checked={showYourData}
                />
                <label htmlFor="yourData">{filterPane.yourData}</label>
              </div>
            </>
          ) : null}
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
            {COLLECTION_METHODS.map((method) => (
              <li key={method.name}>
                <ExpandClickableArea
                  onClick={() =>
                    handleMethodFilter({
                      target: { name: method.name, checked: !methodFilters.includes(method.name) },
                    })
                  }
                >
                  <input
                    id={method.name}
                    type="checkbox"
                    name={method.name}
                    onChange={handleMethodFilter}
                    checked={methodFilters.includes(method.name)}
                    style={{ marginRight: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <StyledLabel htmlFor={method.name} onClick={(e) => e.stopPropagation()}>
                    {method.description}
                  </StyledLabel>
                </ExpandClickableArea>
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
                <ExpandClickableArea onClick={() => handleCheckProject(project.project_id)}>
                  <input
                    id={`checkbox-${project.project_id}`}
                    type="checkbox"
                    checked={checkedProjects.includes(project.project_id)}
                    onChange={() => handleCheckProject(project.project_id)}
                  />{' '}
                  <StyledLabel
                    htmlFor={`checkbox-${project.project_id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.records[0]?.project_name}{' '}
                    {userIsMemberOfProject(project.project_id, mermaidUserData) && <IconUser />}
                  </StyledLabel>
                </ExpandClickableArea>
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

export default FilterPane
