import { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import useResponsive from '../../hooks/useResponsive'

import { IconPersonCircle } from '../../assets/dashboardOnlyIcons'
import coralReefSvg from '../../assets/coral_reef.svg'
import mapPin from '../../assets/map-pin.png'
import { StyledHeader } from './MetricsPane.styles'
import {
  BiggerIconCalendar,
  BiggerIconClose,
  BiggerIconDataSharing,
  BiggerIconGlobe,
  BiggerIconPersonCircle,
  BiggerIconText,
  BiggerIconTextBoxMultiple,
  BiggerIconUser,
  SelectedSiteContentContainer,
  SelectedSiteContentContainerWiderOnMobile,
  SelectedSiteMetricsCardContainer,
  StyledMapPinContainer,
  StyledReefContainer,
  StyledReefItem,
  StyledReefItemBold,
  StyledReefRow,
  StyledSvgContainer,
  StyledVisibleBackground,
  TabButtonContainer,
  TabContent,
} from './SelectedSiteMetrics.styles'
import { ButtonPrimary, ButtonSecondary, ButtonThatLooksLikeLink, CloseButton } from '../generic'
import {
  MermaidFormContainer,
  MermaidFormControl,
  MermaidMenuItem,
  MermaidOutlinedInput,
  MermaidSelect,
} from '../generic/MermaidMui'

import { getSurverysAtSimilarSites } from '../../helperFunctions/getSurveysAtSimilarSites'
import { getMermaidLocaleDateString } from '../../helperFunctions/getMermaidLocaleDateString'

const TAB_NAMES = { summary: 'summary', metadata: 'metadata' }

export const SelectedSiteMetrics = ({
  selectedSampleEvent,
  setSelectedSampleEvent,
  showMobileExpandedMetricsPane = false,
}) => {
  const {
    displayedProjects,
    getURLParams,
    mermaidUserData,
    setSelectedMarkerId,
    updateURLParams,
    userIsMemberOfProject,
    updateCurrentSampleEvent,
  } = useContext(FilterProjectsContext)
  const [metricsView, setMetricsView] = useState(TAB_NAMES.summary)
  const {
    sample_event_id: sampleEventId,
    site_notes: siteNotes,
    project_id: projectId,
    project_name: projectName,
    site_id: siteId,
    site_name: siteName,
    project_admins: projectAdmins,
    tags: organizations,
    sample_date: sampleDate,
    management_name: managementName,
    reef_zone: reefZone,
    reef_type: reefType,
    reef_exposure: reefExposure,
    data_policy_beltfish: dataPolicyBeltfish,
    data_policy_benthiclit: dataPolicyBenthiclit,
    data_policy_bleachingqc: dataPolicyBleachingqc,
  } = selectedSampleEvent
  const initialAreSurveyNotesTruncated = siteNotes.length > 250
  const [areSurveyNotesTruncated, setAreSurveyNotesTruncated] = useState(
    initialAreSurveyNotesTruncated,
  )
  const siteNotesTruncated = <>{siteNotes.slice(0, 249)}... </>
  const toggleAreSurveyNotesTruncatedButton = initialAreSurveyNotesTruncated ? (
    <ButtonThatLooksLikeLink onClick={() => setAreSurveyNotesTruncated(!areSurveyNotesTruncated)}>
      {areSurveyNotesTruncated ? 'read more' : 'read less'}
    </ButtonThatLooksLikeLink>
  ) : null
  const { isDesktopWidth } = useResponsive()
  const sampleEventAdmins = projectAdmins
    .filter((admin) => admin.name !== ' ')
    .map((admin) => admin.name)
    .join(', ')
  const sampleEventOrganizations = organizations?.map((tag) => tag.name).join(', ')
  const project = displayedProjects?.find((project) => project.project_id === projectId)
  const projectRecordsForSite = project?.records?.filter((record) => record.site_id === siteId)

  const handleClearSelectedSampleEvent = () => {
    setSelectedSampleEvent(null)
    setSelectedMarkerId(null)
    const queryParams = getURLParams()
    queryParams.delete('sample_event_id')
    updateURLParams(queryParams)
  }

  const handleSurveyChange = ({ target: { value } }) => {
    updateCurrentSampleEvent(value)
  }

  const surveysAtSimilarSites = getSurverysAtSimilarSites({
    projectData: displayedProjects,
    surveyToCompareTo: selectedSampleEvent,
  })

  const getProjectSiteOptionLabel = (survey) => `${survey.project_name} - ${survey.site_name}`

  // we only show one survey per site in the project-site drop down since the user will be able to select other surveys at each site from the sample date drop down
  const oneSurveyPerSimilarSiteList = surveysAtSimilarSites
    .sort((a, b) => new Date(b.sample_date).getTime() - new Date(a.sample_date).getTime()) // we first sort the similar sites so that we get the most recent survey at a site showing as selected in the sample date drop down
    .reduce(
      (accumulatedSurveys, newSurvey) => {
        const doesSurveyFromSameSiteAlreadyExist = accumulatedSurveys.some(
          (accumulatedSurvey) => accumulatedSurvey.site_id === newSurvey.site_id,
        )

        return doesSurveyFromSameSiteAlreadyExist
          ? accumulatedSurveys
          : [...accumulatedSurveys, newSurvey]
      },
      [selectedSampleEvent], // we initialize with selected sample event so that the dropdown current value will show the current survey selected
    )
    .sort((a, b) => getProjectSiteOptionLabel(a).localeCompare(getProjectSiteOptionLabel(b)))

  const similarSiteMenuItems = oneSurveyPerSimilarSiteList.map(
    ({ sample_event_id, ...restOfSurvey }) => (
      <MermaidMenuItem key={sample_event_id} value={sample_event_id}>
        {getProjectSiteOptionLabel(restOfSurvey)}
      </MermaidMenuItem>
    ),
  )

  const projectSiteSelectCardContent = (
    <>
      <StyledHeader>Select Project/Site</StyledHeader>
      <MermaidFormContainer>
        <MermaidFormControl>
          <MermaidSelect
            input={<MermaidOutlinedInput />}
            value={sampleEventId}
            onChange={handleSurveyChange}
          >
            {similarSiteMenuItems}
          </MermaidSelect>
        </MermaidFormControl>
      </MermaidFormContainer>
    </>
  )

  const mobileProjectSiteContent = showMobileExpandedMetricsPane ? (
    projectSiteSelectCardContent
  ) : (
    <>
      <StyledHeader>Project/Site</StyledHeader>
      <span>{getProjectSiteOptionLabel(selectedSampleEvent)}</span>
    </>
  )
  const projectSiteContent = isDesktopWidth
    ? projectSiteSelectCardContent
    : mobileProjectSiteContent

  const selectedSiteHeader = (
    <StyledVisibleBackground>
      <SelectedSiteMetricsCardContainer>
        <StyledMapPinContainer>
          <img src={mapPin} alt="map-pin" />
        </StyledMapPinContainer>
        <SelectedSiteContentContainerWiderOnMobile>
          {similarSiteMenuItems.length > 1 ? (
            <>{projectSiteContent}</>
          ) : (
            <>
              <StyledHeader>Site</StyledHeader>
              <span>{siteName}</span>
            </>
          )}
        </SelectedSiteContentContainerWiderOnMobile>
        <CloseButton type="button" onClick={handleClearSelectedSampleEvent}>
          <BiggerIconClose />
        </CloseButton>
      </SelectedSiteMetricsCardContainer>
    </StyledVisibleBackground>
  )

  const otherSurveysAtSameProjectSiteMenuItems = projectRecordsForSite
    ?.sort((a, b) => new Date(a.sample_date).getTime() - new Date(b.sample_date).getTime())
    .map(({ sample_date, sample_event_id }) => {
      return (
        <MermaidMenuItem key={sample_event_id} value={sample_event_id}>
          {getMermaidLocaleDateString(sample_date)}
        </MermaidMenuItem>
      )
    })

  const selectedSiteBody =
    showMobileExpandedMetricsPane || isDesktopWidth ? (
      <>
        <SelectedSiteMetricsCardContainer>
          <BiggerIconTextBoxMultiple />
          <SelectedSiteContentContainer>
            <StyledHeader>Project</StyledHeader>
            <span>
              {projectName}{' '}
              {userIsMemberOfProject(projectId, mermaidUserData) ? <IconPersonCircle /> : null}
            </span>
          </SelectedSiteContentContainer>
        </SelectedSiteMetricsCardContainer>
        <SelectedSiteMetricsCardContainer>
          <BiggerIconCalendar />
          <SelectedSiteContentContainer>
            <StyledHeader as="label">Sample Date</StyledHeader>
            {otherSurveysAtSameProjectSiteMenuItems?.length > 1 ? (
              <MermaidFormContainer>
                <MermaidFormControl>
                  <MermaidSelect
                    value={sampleEventId}
                    onChange={handleSurveyChange}
                    input={<MermaidOutlinedInput />}
                  >
                    {otherSurveysAtSameProjectSiteMenuItems}
                  </MermaidSelect>
                </MermaidFormControl>
              </MermaidFormContainer>
            ) : (
              <span>{getMermaidLocaleDateString(sampleDate)}</span>
            )}
          </SelectedSiteContentContainer>
        </SelectedSiteMetricsCardContainer>
        <TabButtonContainer>
          {metricsView === TAB_NAMES.summary ? (
            <>
              <ButtonPrimary onClick={() => setMetricsView(TAB_NAMES.summary)}>
                Summary
              </ButtonPrimary>
              <ButtonSecondary onClick={() => setMetricsView(TAB_NAMES.metadata)}>
                Metadata
              </ButtonSecondary>
            </>
          ) : (
            <>
              <ButtonSecondary onClick={() => setMetricsView(TAB_NAMES.summary)}>
                Summary
              </ButtonSecondary>
              <ButtonPrimary onClick={() => setMetricsView(TAB_NAMES.metadata)}>
                Metadata
              </ButtonPrimary>
            </>
          )}
        </TabButtonContainer>
        <TabContent>
          {metricsView === TAB_NAMES.summary ? (
            <span>Placeholder: show summary metrics here</span>
          ) : (
            <>
              <SelectedSiteMetricsCardContainer>
                <BiggerIconPersonCircle />
                <SelectedSiteContentContainer>
                  <StyledHeader>Management Regime</StyledHeader>
                  <span>{managementName}</span>
                </SelectedSiteContentContainer>
              </SelectedSiteMetricsCardContainer>
              <SelectedSiteMetricsCardContainer>
                <BiggerIconUser />
                <SelectedSiteContentContainer>
                  <StyledHeader>Admins</StyledHeader>
                  <span>{sampleEventAdmins}</span>
                </SelectedSiteContentContainer>
              </SelectedSiteMetricsCardContainer>
              {organizations?.length ? (
                <SelectedSiteMetricsCardContainer>
                  <BiggerIconGlobe />
                  <SelectedSiteContentContainer>
                    <StyledHeader>Organizations</StyledHeader>
                    <span>{sampleEventOrganizations}</span>
                  </SelectedSiteContentContainer>
                </SelectedSiteMetricsCardContainer>
              ) : null}

              <SelectedSiteMetricsCardContainer>
                <StyledSvgContainer>
                  <img src={coralReefSvg} alt="coral reef" />
                </StyledSvgContainer>
                <SelectedSiteContentContainer>
                  <StyledHeader>Reef Habitat</StyledHeader>
                  <StyledReefContainer>
                    <StyledReefRow>
                      <StyledReefItemBold>Reef Zone</StyledReefItemBold>
                      <StyledReefItem>{reefZone}</StyledReefItem>
                    </StyledReefRow>
                    <StyledReefRow>
                      <StyledReefItemBold>Reef Type</StyledReefItemBold>
                      <StyledReefItem>{reefType}</StyledReefItem>
                    </StyledReefRow>
                    <StyledReefRow>
                      <StyledReefItemBold>Reef Exposure</StyledReefItemBold>
                      <StyledReefItem>{reefExposure}</StyledReefItem>
                    </StyledReefRow>
                  </StyledReefContainer>
                </SelectedSiteContentContainer>
              </SelectedSiteMetricsCardContainer>
              {dataPolicyBeltfish || dataPolicyBenthiclit || dataPolicyBleachingqc ? (
                <SelectedSiteMetricsCardContainer>
                  <BiggerIconDataSharing />
                  <SelectedSiteContentContainer>
                    <StyledHeader>Data Sharing</StyledHeader>
                    <StyledReefContainer>
                      <StyledReefRow>
                        <StyledReefItemBold>Fish Belt</StyledReefItemBold>
                        <StyledReefItem>{dataPolicyBeltfish}</StyledReefItem>
                      </StyledReefRow>
                      <StyledReefRow>
                        <StyledReefItemBold>Benthic</StyledReefItemBold>
                        <StyledReefItem>{dataPolicyBenthiclit}</StyledReefItem>
                      </StyledReefRow>
                      <StyledReefRow>
                        <StyledReefItemBold>Bleaching</StyledReefItemBold>
                        <StyledReefItem>{dataPolicyBleachingqc}</StyledReefItem>
                      </StyledReefRow>
                    </StyledReefContainer>
                  </SelectedSiteContentContainer>
                </SelectedSiteMetricsCardContainer>
              ) : null}
              {siteNotes ? (
                <SelectedSiteMetricsCardContainer>
                  <BiggerIconText />
                  <SelectedSiteContentContainerWiderOnMobile>
                    <StyledHeader>Notes</StyledHeader>
                    <span>
                      {areSurveyNotesTruncated ? siteNotesTruncated : siteNotes}{' '}
                      {toggleAreSurveyNotesTruncatedButton}
                    </span>
                  </SelectedSiteContentContainerWiderOnMobile>
                </SelectedSiteMetricsCardContainer>
              ) : null}
            </>
          )}
        </TabContent>
      </>
    ) : null

  return (
    <>
      {selectedSiteHeader}
      {selectedSiteBody}
    </>
  )
}

SelectedSiteMetrics.propTypes = {
  selectedSampleEvent: PropTypes.object.isRequired,
  setSelectedSampleEvent: PropTypes.func.isRequired,
  showMobileExpandedMetricsPane: PropTypes.bool,
}
