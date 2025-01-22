import { useEffect, useState, useCallback, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import theme from '../../styles/theme'
import { URL_PARAMS, COLLECTION_METHODS } from '../../constants/constants'
import { filterPane, autocompleteGroupNames } from '../../constants/language'
import { IconPlus } from '../../assets/icons'
import { IconMinus } from '../../assets/dashboardOnlyIcons'

import {
  ExpandableFilterRowContainer,
  ShowMoreFiltersContainer,
  StyledCategoryContainer,
  StyledClickableArea,
  StyledDateField,
  StyledDateRangeContainer,
  StyledEmptyListItem,
  StyledExpandFilters,
  StyledFilterPaneContainer,
  StyledHeader,
  StyledLabel,
  StyledLi,
  StyledMethodListContainer,
  StyledProjectListContainer,
  StyledProjectNameFilter,
  StyledUnorderedList,
  TieredStyledClickableArea,
  ToggleMethodDataSharingButton,
  StyledDateInputContainer,
  StyledCountryHeader,
  StyledLoginToViewContainer,
  SmallerIconUserCircle,
} from './FilterPane.styles'

import FilterIndicatorPill from '../generic/FilterIndicatorPill'
import AutocompleteCheckbox from '../generic/AutocompleteCheckbox'
import { ButtonThatLooksLikeLinkUnderlined, IconButton } from '../generic'
import { MuiTooltip } from '../generic/MuiTooltip'

const DATA_SHARING_LABELS = ['Public', 'Public Summary', 'Private']

const FilterPane = ({ mermaidUserData }) => {
  const todayDate = dayjs()
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const {
    checkedProjects,
    countriesSelectOnOpen,
    clearAllFilters,
    displayedCountries,
    displayedOrganizations,
    displayedProjects,
    getActiveProjectCount,
    handleChangeSampleDateAfter,
    handleChangeSampleDateBefore,
    handleMethodDataSharingFilter,
    handleProjectNameFilter,
    handleSelectedCountriesChange,
    handleSelectedOrganizationsChange,
    handleYourDataFilter,
    isAnyActiveFilters,
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
    showProjectsWithNoRecords,
    setShowProjectsWithNoRecords,
  } = useContext(FilterProjectsContext)
  const [expandedSections, setExpandedSections] = useState({
    beltfish: false,
    colonies_bleached: false,
    benthicpit: false,
    benthiclit: false,
    quadrat_benthic_percent: false,
    habitatcomplexity: false,
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

  const handleLogin = () => {
    loginWithRedirect({ appState: { returnTo: location.search } })
  }

  const handleStartDateChange = (newStartDate) => {
    const isStartDateValid = newStartDate?.isValid()
    const isBeforeEndDate = !sampleDateBefore || newStartDate?.isBefore(sampleDateBefore)

    if (!newStartDate || (isStartDateValid && isBeforeEndDate)) {
      handleChangeSampleDateAfter(newStartDate)
    }
  }

  const handleEndDateChange = (newEndDate) => {
    const isEndDateValid = newEndDate?.isValid()
    const isAfterBeforeDate = !sampleDateAfter || newEndDate?.isAfter(sampleDateAfter)

    if (!newEndDate || (isEndDateValid && isAfterBeforeDate)) {
      handleChangeSampleDateBefore(newEndDate)
    }
  }

  const handleDeleteCountry = (countryToBeDeleted) => {
    const updatedCountries = selectedCountries.filter((country) => country !== countryToBeDeleted)
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

  const handleDeleteOrganization = (organizationToBeDeleted) => {
    const updatedOrganizations = selectedOrganizations.filter(
      (organization) => organization !== organizationToBeDeleted,
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

  const getCountriesAutocompleteGroup = (option) => {
    return remainingDisplayedCountries.length
      ? displayedCountries.includes(option)
        ? autocompleteGroupNames.countriesBasedOnCurrentFilters
        : autocompleteGroupNames.otherCountries
      : ''
  }

  const getOrganizationsAutocompleteGroup = () => {
    return !!isAnyActiveFilters() ? autocompleteGroupNames.organizationsBasedOnCurrentFilters : ''
  }

  const handleShowProjectsWithNoRecords = () => {
    setShowProjectsWithNoRecords(!showProjectsWithNoRecords)
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
                      <MuiTooltip
                        title="You are part of this project"
                        placement="top"
                        bgColor={theme.color.primaryColor}
                        tooltipTextColor={theme.color.white}
                      >
                        <IconButton>
                          <SmallerIconUserCircle />
                        </IconButton>
                      </MuiTooltip>
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
      <StyledCountryHeader>
        <StyledHeader>Countries</StyledHeader>
        {isAnyActiveFilters() && getActiveProjectCount() < projectData?.count ? (
          <FilterIndicatorPill
            searchFilteredRowLength={getActiveProjectCount()}
            unfilteredRowLength={projectData?.count || 0}
            clearFilters={clearAllFilters}
          />
        ) : null}
      </StyledCountryHeader>
      <AutocompleteCheckbox
        selectedValues={selectedCountries}
        displayOptions={displayedCountries}
        remainingOptions={remainingDisplayedCountries}
        autocompleteGroupBy={getCountriesAutocompleteGroup}
        onOpen={countriesSelectOnOpen}
        onChange={handleSelectedCountriesChange}
        onDelete={handleDeleteCountry}
      />
      <StyledHeader>Organizations</StyledHeader>
      <AutocompleteCheckbox
        selectedValues={selectedOrganizations}
        displayOptions={displayedOrganizations}
        autocompleteGroupBy={getOrganizationsAutocompleteGroup}
        onOpen={organizationsSelectOnOpen}
        onChange={handleSelectedOrganizationsChange}
        onDelete={handleDeleteOrganization}
      />
      <StyledExpandFilters onClick={() => setShowMoreFilters(!showMoreFilters)}>
        Show {showMoreFilters ? 'fewer' : 'more'} filters
      </StyledExpandFilters>
      {showMoreFilters ? (
        <ShowMoreFiltersContainer>
          <StyledHeader>Date Range</StyledHeader>
          <StyledDateRangeContainer>
            <StyledDateInputContainer>
              <span>From</span>
              <DatePicker
                id="start-date"
                value={sampleDateAfter}
                onChange={(date) => handleStartDateChange(date)}
                format="YYYY-MM-DD"
                maxDate={sampleDateBefore ? dayjs(sampleDateBefore) : todayDate}
                slots={{ textField: StyledDateField }}
                slotProps={{
                  textField: { clearable: true, size: 'small' },
                  actionBar: ({ wrapperVariant }) => ({
                    actions: wrapperVariant === 'desktop' ? [] : ['clear', 'cancel', 'accept'],
                  }),
                }}
              />
            </StyledDateInputContainer>
            <StyledDateInputContainer>
              <span>To</span>
              <DatePicker
                id="end-date"
                value={sampleDateBefore}
                onChange={(date) => handleEndDateChange(date)}
                format="YYYY-MM-DD"
                minDate={sampleDateAfter ? dayjs(sampleDateAfter) : undefined}
                maxDate={todayDate}
                slots={{ textField: StyledDateField }}
                slotProps={{
                  textField: { clearable: true, size: 'small' },
                  actionBar: ({ wrapperVariant }) => ({
                    actions: wrapperVariant === 'desktop' ? [] : ['clear', 'cancel', 'accept'],
                  }),
                }}
              />
            </StyledDateInputContainer>
          </StyledDateRangeContainer>
          <StyledHeader>Your Data</StyledHeader>
          {isAuthenticated ? (
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
          ) : (
            <StyledLoginToViewContainer>
              <div>
                <ButtonThatLooksLikeLinkUnderlined onClick={handleLogin}>
                  Login
                </ButtonThatLooksLikeLinkUnderlined>{' '}
                to view your project only
              </div>
            </StyledLoginToViewContainer>
          )}
          <StyledHeader>Methods / Data Sharing</StyledHeader>
          {methodsList}
          <StyledHeader>No Data</StyledHeader>
          <StyledCategoryContainer>
            <StyledClickableArea onClick={handleShowProjectsWithNoRecords}>
              <input
                type="checkbox"
                name="showNoData"
                id="show-no-data"
                onChange={handleShowProjectsWithNoRecords}
                checked={showProjectsWithNoRecords}
              />
              <StyledLabel htmlFor="show-no-data" onClick={(e) => e.stopPropagation()}>
                Show Projects With No Data
              </StyledLabel>
            </StyledClickableArea>
          </StyledCategoryContainer>
        </ShowMoreFiltersContainer>
      ) : null}
      <StyledHeader>Projects</StyledHeader>
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
