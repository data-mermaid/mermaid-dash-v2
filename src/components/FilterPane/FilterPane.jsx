import PropTypes from 'prop-types'
import { Select, Box, IconButton } from '@mui/material'
import {
  StyledHeader,
  StyledFormContainer,
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
  StyledMethodListContainer,
  StyledDateInputContainer,
  StyledDateInput,
  StyledMenuItem,
  StyledListSubheader,
  StyledClickableArea,
  StyledLabel,
  StyledCategoryContainer,
  StyledEmptyListItem,
  TieredCheckboxContainer,
  ToggleDataSharingButton,
} from './FilterPane.styles'
import { filterPane } from '../../constants/language'
import { URL_PARAMS, COLLECTION_METHODS, DATA_SHARING_OPTIONS } from '../../constants/constants'
import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconClose, IconPlus } from '../../assets/icons'
import { IconUserCircle, IconMinus } from '../../assets/dashboardOnlyIcons'
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

const DATA_SHARING_LABELS = [
  'Fish Belt',
  'Benthic: PIT, LIT, PQT, and Habitat Complexity',
  'Bleaching',
]

const FilterPane = ({ mermaidUserData }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth0()
  const {
    projectData,
    setCountries,
    setOrganizations,
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
    handleMethodFilter,
    handleProjectNameFilter,
    handleYourDataFilter,
    userIsMemberOfProject,
    displayedCountries,
    setDisplayedCountries,
    remainingDisplayedCountries,
    displayedOrganizations,
    setDisplayedOrganizations,
    countriesSelectOnOpen,
    organizationsSelectOnOpen,
    setDataSharingFilter,
  } = useFilterProjectsContext()
  const [expandedSections, setExpandedSections] = useState({
    public: false,
    publicSummary: false,
    private: false,
  })

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
  }, [
    projectData.results,
    setCountries,
    setDisplayedCountries,
    setDisplayedOrganizations,
    setOrganizations,
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

  const renderMethods = () => (
    <StyledMethodListContainer>
      <StyledUnorderedList>
        {COLLECTION_METHODS.map((method) => (
          <li key={method.name}>
            <StyledClickableArea
              onClick={() =>
                handleMethodFilter({
                  target: {
                    name: method.name,
                    checked: !methodFilters.includes(method.name),
                  },
                })
              }
            >
              <input
                id={method.name}
                type="checkbox"
                name={method.name}
                onChange={handleMethodFilter}
                checked={methodFilters.includes(method.name)}
                onClick={(e) => e.stopPropagation()}
              />
              <StyledLabel htmlFor={method.name} onClick={(e) => e.stopPropagation()}>
                {method.description}
              </StyledLabel>
            </StyledClickableArea>
          </li>
        ))}
      </StyledUnorderedList>
    </StyledMethodListContainer>
  )

  const renderDisplayedProjects = () => (
    <StyledProjectListContainer>
      <StyledUnorderedList>
        {displayedProjects.length ? (
          displayedProjects.map((project) => {
            return (
              <li key={project.project_id}>
                <StyledClickableArea onClick={() => handleCheckProject(project.project_id)}>
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
                    {project.project_name}{' '}
                    {userIsMemberOfProject(project.project_id, mermaidUserData) && (
                      <IconUserCircle />
                    )}
                  </StyledLabel>
                </StyledClickableArea>
              </li>
            )
          })
        ) : (
          <StyledEmptyListItem>No projects match current filters</StyledEmptyListItem>
        )}
      </StyledUnorderedList>
    </StyledProjectListContainer>
  )

  const toggleShowExpanded = (section) => (e) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
    e.stopPropagation()
  }

  const toggleDataSharingAll = (section) => (e) => {
    const { checked } = e.target
    const options = DATA_SHARING_OPTIONS[section]
    const prevDataSharingFilter = [...dataSharingFilter]
    const updatedFilter = checked
      ? [...new Set([...prevDataSharingFilter, ...options])]
      : prevDataSharingFilter.filter((option) => !options.includes(option))

    setDataSharingFilter(updatedFilter)

    const queryParams = getURLParams()
    if (updatedFilter.length === 0) {
      queryParams.delete('dataSharing')
    } else {
      queryParams.set('dataSharing', updatedFilter)
    }
    updateURLParams(queryParams)
  }

  const toggleDataSharingOption = (section) => (e) => {
    const { checked, name } = e.target
    const allOptions = DATA_SHARING_OPTIONS[section].slice(1) // Exclude the 'all' option
    let updatedFilter

    if (checked) {
      updatedFilter = [...dataSharingFilter, name]
      const allChecked = allOptions.every((option) => updatedFilter.includes(option))
      if (allChecked) {
        updatedFilter.push(DATA_SHARING_OPTIONS[section][0]) // Add the 'all' option
      }
    } else {
      updatedFilter = [...dataSharingFilter].filter(
        (option) => ![DATA_SHARING_OPTIONS[section][0], name].includes(option),
      )
    }
    setDataSharingFilter(updatedFilter)

    const queryParams = getURLParams()
    if (updatedFilter.length === 0) {
      queryParams.delete('dataSharing')
    } else {
      queryParams.set('dataSharing', updatedFilter)
    }
    updateURLParams(queryParams)
  }

  const renderSection = (section, label) => (
    <>
      <StyledClickableArea>
        <input
          type="checkbox"
          name={`${section}All`}
          id={DATA_SHARING_OPTIONS[section][0]}
          onChange={toggleDataSharingAll(section)}
          checked={dataSharingFilter.includes(DATA_SHARING_OPTIONS[section][0])}
        />
        <StyledLabel
          htmlFor={DATA_SHARING_OPTIONS[section][0]}
          onClick={(e) => e.stopPropagation()}
        >
          {label}
        </StyledLabel>
        <ToggleDataSharingButton onClick={toggleShowExpanded(section)}>
          {expandedSections[section] ? <IconMinus /> : <IconPlus />}
        </ToggleDataSharingButton>
      </StyledClickableArea>
      {expandedSections[section] && (
        <TieredCheckboxContainer>
          {DATA_SHARING_OPTIONS[section].slice(1).map((option, index) => (
            <StyledClickableArea key={option}>
              <input
                type="checkbox"
                checked={dataSharingFilter.includes(option)}
                onChange={toggleDataSharingOption(section)}
                name={option}
                id={option}
              />
              <StyledLabel htmlFor={option}>{DATA_SHARING_LABELS[index]}</StyledLabel>
            </StyledClickableArea>
          ))}
        </TieredCheckboxContainer>
      )}
    </>
  )

  const renderDataSharingFilter = () => (
    <>
      <StyledHeader>Data sharing</StyledHeader>
      <StyledCategoryContainer>
        {renderSection('public', 'Public')}
        {renderSection('publicSummary', 'Public Summary')}
        {renderSection('private', 'Private')}
      </StyledCategoryContainer>
    </>
  )

  return (
    <StyledFilterPaneContainer>
      <StyledHeader>Countries</StyledHeader>
      <StyledFormContainer>
        <StyledFormControl>
          <Select
            multiple
            value={selectedCountries}
            onChange={handleSelectedCountriesChange}
            input={<StyledOutlinedInput />}
            sx={selectCustomStyles}
            MenuProps={selectCustomStyles.MenuProps}
            onOpen={countriesSelectOnOpen}
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
            {remainingDisplayedCountries.length ? (
              <StyledListSubheader>Countries based on current filters</StyledListSubheader>
            ) : null}
            {displayedCountries.map((country) => (
              <StyledMenuItem key={`matches-${country}`} value={country}>
                <input type="checkbox" checked={selectedCountries.includes(country)} readOnly />
                {country}
              </StyledMenuItem>
            ))}
            {remainingDisplayedCountries.length ? (
              <StyledListSubheader>Other countries</StyledListSubheader>
            ) : null}
            {remainingDisplayedCountries.map((country) => (
              <StyledMenuItem key={`nonmatches-${country}`} value={country}>
                <input type="checkbox" checked={selectedCountries.includes(country)} readOnly />
                {country}
              </StyledMenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledFormContainer>
      <StyledHeader>Organizations</StyledHeader>
      <StyledFormContainer>
        <StyledFormControl>
          <Select
            multiple
            value={selectedOrganizations}
            onChange={handleSelectedOrganizationsChange}
            input={<StyledOutlinedInput />}
            sx={selectCustomStyles}
            MenuProps={selectCustomStyles.MenuProps}
            onOpen={organizationsSelectOnOpen}
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
            <StyledListSubheader>
              {displayedOrganizations.length
                ? 'Organizations based on current filters'
                : 'No organizations match current filters'}
            </StyledListSubheader>
            {displayedOrganizations.map((organization) => (
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
      </StyledFormContainer>
      <StyledExpandFilters onClick={() => setShowMoreFilters(!showMoreFilters)}>
        Show {showMoreFilters ? 'fewer' : 'more'} filters
      </StyledExpandFilters>
      {showMoreFilters ? (
        <ShowMoreFiltersContainer>
          <StyledHeader>Date Range</StyledHeader>
          <StyledDateInputContainer>
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
          </StyledDateInputContainer>
          {isAuthenticated ? (
            <>
              <StyledHeader>Your Data</StyledHeader>
              <StyledCategoryContainer>
                <StyledClickableArea
                  onClick={() => handleYourDataFilter({ target: { checked: !showYourData } })}
                >
                  <input
                    type="checkbox"
                    name="yourData"
                    id="your-data"
                    onChange={handleYourDataFilter}
                    checked={showYourData}
                  />
                  <StyledLabel htmlFor="your-data" onClick={(e) => e.stopPropagation()}>
                    {filterPane.yourData}
                  </StyledLabel>
                </StyledClickableArea>
              </StyledCategoryContainer>
            </>
          ) : null}
          {renderDataSharingFilter()}
          <StyledHeader>Methods</StyledHeader>
          {renderMethods()}
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
      {renderDisplayedProjects()}
    </StyledFilterPaneContainer>
  )
}

FilterPane.propTypes = {
  mermaidUserData: PropTypes.object,
}

export default FilterPane
