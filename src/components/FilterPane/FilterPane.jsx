import PropTypes from 'prop-types'
import { Box, IconButton } from '@mui/material'

import {
  ExpandableFilterRowContainer,
  ShowMoreFiltersContainer,
  StyledCategoryContainer,
  StyledClickableArea,
  StyledDateInput,
  StyledDateInputContainer,
  StyledEmptyListItem,
  StyledExpandFilters,
  StyledFilterPaneContainer,
  StyledHeader,
  StyledLabel,
  StyledLi,
  StyledMethodListContainer,
  StyledProjectListContainer,
  StyledProjectNameFilter,
  StyledProjectsHeader,
  StyledUnorderedList,
  TieredStyledClickableArea,
  ToggleMethodDataSharingButton,
} from './FilterPane.styles'
import { filterPane } from '../../constants/language'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { IconClose, IconPlus } from '../../assets/icons'
import { IconUserCircle, IconMinus } from '../../assets/dashboardOnlyIcons'
import { URL_PARAMS, COLLECTION_METHODS } from '../../constants/constants'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState, useCallback, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MermaidChip,
  MermaidFormContainer,
  MermaidFormControl,
  MermaidListSubheader,
  MermaidMenuItem,
  MermaidOutlinedInput,
  MermaidSelect,
} from '../generic/MermaidMui'
import dayjs from 'dayjs'

const EARLIEST_DATE = '1900-01-01'

const isDateValid = (date) => dayjs(date, 'YYYY-MM-DD', true).isValid()

const deleteIconSize = {
  height: '15px',
  width: '15px',
}

const selectBoxCustomStyles = { display: 'flex', flexWrap: 'wrap', gap: 0.5 }

const DATA_SHARING_LABELS = ['Public', 'Public Summary', 'Private']

const FilterPane = ({ mermaidUserData }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth0()
  const {
    checkedProjects,
    countriesSelectOnOpen,
    displayedCountries,
    displayedOrganizations,
    displayedProjects,
    formattedDate,
    getActiveProjectCount,
    handleChangeSampleDateAfter,
    handleChangeSampleDateBefore,
    handleMethodDataSharingFilter,
    handleProjectNameFilter,
    handleSelectedCountriesChange,
    handleSelectedOrganizationsChange,
    handleYourDataFilter,
    methodDataSharingFilters,
    organizationsSelectOnOpen,
    projectData,
    projectNameFilter,
    remainingDisplayedCountries,
    sampleDateAfter,
    sampleDateBefore,
    selectedCountries,
    selectedOrganizations,
    setCheckedProjects,
    setCountries,
    setDisplayedCountries,
    setDisplayedOrganizations,
    setSelectedCountries,
    setSelectedOrganizations,
    showYourData,
    userIsMemberOfProject,
  } = useContext(FilterProjectsContext)
  const [expandedSections, setExpandedSections] = useState({
    beltfish: false,
    colonies_bleached: false,
    benthicpit: false,
    benthiclit: false,
    quadrat_benthic_percent: false,
    habitatcomplexity: false,
  })
  const [startDate, setStartDate] = useState(sampleDateAfter)
  const [endDate, setEndDate] = useState(sampleDateBefore)

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
  }, [projectData.results, setCountries, setDisplayedCountries, setDisplayedOrganizations])

  const getURLParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const updateURLParams = useCallback(
    (queryParams) => {
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname],
  )

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate)

    const isBeforeEndDate = () => {
      if (endDate === '') {
        return true
      }

      if (dayjs(newStartDate).isBefore(dayjs(endDate))) {
        return true
      }
    }

    if (
      newStartDate === '' ||
      (isDateValid(newStartDate) &&
        isBeforeEndDate() &&
        dayjs(newStartDate).isAfter(dayjs(EARLIEST_DATE)))
    ) {
      console.log('start date is being set', newStartDate, isDateValid(newStartDate))
      handleChangeSampleDateAfter(newStartDate)
    }
  }

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate)

    if (
      newEndDate === '' ||
      (isDateValid(newEndDate) &&
        dayjs(newEndDate).isAfter(dayjs(sampleDateAfter)) &&
        dayjs(newEndDate).isAfter(dayjs(EARLIEST_DATE)))
    ) {
      console.log('end date is being set')
      handleChangeSampleDateBefore(newEndDate)
    }
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

  const toggleShowExpanded = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isIndeterminate = (inputElement, methodName) => {
    if (!inputElement) {
      return
    }

    const foundMethod = COLLECTION_METHODS[methodName]
    const allDataSharingOptionsChecked = foundMethod.dataSharingOptions.slice(1).every((option) => {
      return methodDataSharingFilters.includes(option)
    })
    const someDataSharingOptionsChecked = foundMethod.dataSharingOptions.slice(1).some((option) => {
      return methodDataSharingFilters.includes(option)
    })
    inputElement.indeterminate =
      !allDataSharingOptionsChecked && someDataSharingOptionsChecked ? true : false
  }

  const methodsList = (
    <StyledMethodListContainer>
      <StyledUnorderedList>
        {Object.keys(COLLECTION_METHODS).map((method) => {
          const { description, dataSharingOptions } = COLLECTION_METHODS[method]
          return (
            <StyledLi key={method}>
              <ExpandableFilterRowContainer>
                <StyledClickableArea
                  onClick={() =>
                    handleMethodDataSharingFilter({
                      target: {
                        name: dataSharingOptions[0],
                        checked: methodDataSharingFilters.includes(dataSharingOptions[0]),
                      },
                    })
                  }
                >
                  <input
                    id={dataSharingOptions[0]}
                    type="checkbox"
                    name={dataSharingOptions[0]}
                    onChange={handleMethodDataSharingFilter}
                    checked={!methodDataSharingFilters.includes(dataSharingOptions[0])}
                    onClick={(e) => e.stopPropagation()}
                    ref={(inputElement) => isIndeterminate(inputElement, method)}
                  />
                  <StyledLabel htmlFor={dataSharingOptions[0]} onClick={(e) => e.stopPropagation()}>
                    {description}
                  </StyledLabel>
                </StyledClickableArea>
                <ToggleMethodDataSharingButton onClick={() => toggleShowExpanded(method)}>
                  {expandedSections[method] ? <IconMinus /> : <IconPlus />}
                </ToggleMethodDataSharingButton>
              </ExpandableFilterRowContainer>
              {expandedSections[method] ? (
                <>
                  {dataSharingOptions.slice(1).map((option, index) => (
                    <TieredStyledClickableArea
                      key={option}
                      onClick={() =>
                        handleMethodDataSharingFilter({
                          target: {
                            method,
                            name: option,
                            checked: methodDataSharingFilters.includes(option),
                          },
                        })
                      }
                    >
                      <input
                        type="checkbox"
                        name={option}
                        id={option}
                        checked={!methodDataSharingFilters.includes(option)}
                        onChange={handleMethodDataSharingFilter}
                      />
                      <StyledLabel htmlFor={option} onClick={(e) => e.stopPropagation()}>
                        {DATA_SHARING_LABELS[index]}
                      </StyledLabel>
                    </TieredStyledClickableArea>
                  ))}
                </>
              ) : null}
            </StyledLi>
          )
        })}
      </StyledUnorderedList>
    </StyledMethodListContainer>
  )

  const projectsList = (
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

  return (
    <StyledFilterPaneContainer>
      <StyledHeader>Countries</StyledHeader>
      <MermaidFormContainer>
        <MermaidFormControl>
          <MermaidSelect
            multiple
            value={selectedCountries}
            onChange={handleSelectedCountriesChange}
            input={<MermaidOutlinedInput />}
            onOpen={countriesSelectOnOpen}
            renderValue={(selected) => (
              <Box sx={selectBoxCustomStyles}>
                {selected.map((value) => (
                  <MermaidChip
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
              <MermaidListSubheader>Countries based on current filters</MermaidListSubheader>
            ) : null}
            {displayedCountries.map((country) => (
              <MermaidMenuItem key={`matches-${country}`} value={country}>
                <input type="checkbox" checked={selectedCountries.includes(country)} readOnly />
                {country}
              </MermaidMenuItem>
            ))}
            {remainingDisplayedCountries.length ? (
              <MermaidListSubheader>Other countries</MermaidListSubheader>
            ) : null}
            {remainingDisplayedCountries.map((country) => (
              <MermaidMenuItem key={`nonmatches-${country}`} value={country}>
                <input type="checkbox" checked={selectedCountries.includes(country)} readOnly />
                {country}
              </MermaidMenuItem>
            ))}
          </MermaidSelect>
        </MermaidFormControl>
      </MermaidFormContainer>
      <StyledHeader>Organizations</StyledHeader>
      <MermaidFormContainer>
        <MermaidFormControl>
          <MermaidSelect
            multiple
            value={selectedOrganizations}
            onChange={handleSelectedOrganizationsChange}
            input={<MermaidOutlinedInput />}
            onOpen={organizationsSelectOnOpen}
            renderValue={(selected) => (
              <Box sx={selectBoxCustomStyles}>
                {selected.map((value) => (
                  <MermaidChip
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
            <MermaidListSubheader>
              {displayedOrganizations.length
                ? 'Organizations based on current filters'
                : 'No organizations match current filters'}
            </MermaidListSubheader>
            {displayedOrganizations.map((organization) => (
              <MermaidMenuItem key={organization} value={organization}>
                <input
                  type="checkbox"
                  checked={selectedOrganizations.includes(organization)}
                  readOnly
                />
                {organization}
              </MermaidMenuItem>
            ))}
          </MermaidSelect>
        </MermaidFormControl>
      </MermaidFormContainer>
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
                value={formattedDate(startDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
              {startDate && (
                <IconButton
                  aria-label="clear date"
                  onClick={() => handleStartDateChange('')}
                  className="clear-button"
                >
                  <IconClose />
                </IconButton>
              )}
            </StyledDateInput>

            <StyledDateInput>
              <input
                type="date"
                value={formattedDate(endDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
              {endDate && (
                <IconButton
                  aria-label="clear date"
                  onClick={() => handleEndDateChange('')}
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
          <StyledHeader>Methods / Data Sharing</StyledHeader>
          {methodsList}
        </ShowMoreFiltersContainer>
      ) : null}
      <StyledProjectsHeader>
        <span>Projects</span>
        <span>
          {getActiveProjectCount()}/{projectData.count}
        </span>
      </StyledProjectsHeader>
      <StyledProjectNameFilter
        value={projectNameFilter}
        placeholder="Type to filter projects"
        onChange={handleProjectNameFilter}
      />
      {projectsList}
    </StyledFilterPaneContainer>
  )
}

FilterPane.propTypes = {
  mermaidUserData: PropTypes.object,
}

export default FilterPane
