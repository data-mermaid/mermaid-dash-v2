import PropTypes from 'prop-types'

import {
  StyledHeader,
  StyledMetricsSelector,
  StyledSummaryMetadataContainer,
} from './MetricsPane.styles'
import {
  BiggerIconCalendar,
  BiggerIconGlobe,
  BiggerIconPersonCircle,
  BiggerIconText,
  BiggerIconTextBoxMultiple,
  BiggerIconUser,
  SelectedSiteActionBar,
  SelectedSiteContentContainer,
  SelectedSiteMetricsCardContainer,
  SelectedSiteSiteCardContainer,
  StyledMapPinContainer,
  StyledReefContainer,
  StyledReefItem,
  StyledReefItemBold,
  StyledReefRow,
  StyledSvgContainer,
  StyledVisibleBackground,
} from './SelectedSiteMetrics.styles'
import { ButtonSecondary } from '../generic'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { getIsSiteSelected, zoomToSelectedSite } from '../../helperFunctions/selectedSite'
import { IconClose } from '../../assets/icons'
import { IconPersonCircle } from '../../assets/dashboardOnlyIcons'
import { MAIN_MAP_ID } from '../../constants/constants'
import { useContext, useState } from 'react'
import { useMap } from 'react-map-gl'
import coralReefSvg from '../../assets/coral_reef.svg'
import mapPin from '../../assets/map-pin.png'
import useResponsive from '../../hooks/useResponsive'
import ZoomToSiteIcon from '../../assets/zoom_to_selected_sites.svg?react'

export const SelectedSiteMetrics = ({ selectedSampleEvent, view, setSelectedSampleEvent }) => {
  const {
    displayedProjects,
    getURLParams,
    mermaidUserData,
    setSelectedMarkerId,
    updateURLParams,
    userIsMemberOfProject,
  } = useContext(FilterProjectsContext)
  const [metricsView, setMetricsView] = useState('summary')
  const { isDesktopWidth } = useResponsive()
  const isMapView = view === 'mapView'
  const map = useMap()[MAIN_MAP_ID] // the docs for react-map-gl are not clear on the return object for useMap. This is what works in testing. Further, its not a 'ref' its the actual map instance.

  const handleClearSelectedSampleEvent = () => {
    setSelectedSampleEvent(null)
    setSelectedMarkerId(null)
    const queryParams = getURLParams()
    queryParams.delete('sample_event_id')
    updateURLParams(queryParams)
  }

  const sampleEventAdmins = selectedSampleEvent.project_admins.map((admin) => admin.name).join(', ')
  const sampleEventOrganizations = selectedSampleEvent.tags?.map((tag) => tag.name).join(', ')

  const handleChangeMetricsView = (event) => {
    setMetricsView(event.target.name)
  }

  const selectedSiteHeader = (
    <StyledVisibleBackground>
      <SelectedSiteSiteCardContainer>
        <StyledMapPinContainer>
          <img src={mapPin} alt="map-pin" />
        </StyledMapPinContainer>
        <StyledHeader>{selectedSampleEvent.site_name}</StyledHeader>
      </SelectedSiteSiteCardContainer>
    </StyledVisibleBackground>
  )
  const selectedSiteBody = isDesktopWidth ? (
    <>
      <SelectedSiteMetricsCardContainer>
        <BiggerIconTextBoxMultiple />
        <SelectedSiteContentContainer>
          <StyledHeader>Project</StyledHeader>
          <span>
            {selectedSampleEvent.project_name}{' '}
            {userIsMemberOfProject(selectedSampleEvent.project_id, mermaidUserData) ? (
              <IconPersonCircle />
            ) : null}
          </span>
        </SelectedSiteContentContainer>
      </SelectedSiteMetricsCardContainer>
      <SelectedSiteMetricsCardContainer>
        <BiggerIconCalendar />
        <SelectedSiteContentContainer>
          <StyledHeader>Sample Date</StyledHeader>
          <span>{selectedSampleEvent.sample_date}</span>
        </SelectedSiteContentContainer>
      </SelectedSiteMetricsCardContainer>
      <StyledSummaryMetadataContainer>
        <StyledMetricsSelector>
          <input
            id="metrics-summary"
            type="radio"
            name="summary"
            checked={metricsView === 'summary'}
            onChange={handleChangeMetricsView}
          />
          <label htmlFor="metrics-summary">Summary</label>
        </StyledMetricsSelector>
        <StyledMetricsSelector>
          <input
            id="metrics-metadata"
            type="radio"
            name="metadata"
            checked={metricsView === 'metadata'}
            onChange={handleChangeMetricsView}
          />
          <label htmlFor="metrics-metadata">Metadata</label>
        </StyledMetricsSelector>
      </StyledSummaryMetadataContainer>
      {metricsView === 'summary' ? (
        <span>Placeholder: show summary metrics here</span>
      ) : (
        <>
          <SelectedSiteMetricsCardContainer>
            <BiggerIconPersonCircle />
            <SelectedSiteContentContainer>
              <StyledHeader>Management Regime</StyledHeader>
              <span>{selectedSampleEvent.management_name}</span>
            </SelectedSiteContentContainer>
          </SelectedSiteMetricsCardContainer>
          <SelectedSiteMetricsCardContainer>
            <BiggerIconUser />
            <SelectedSiteContentContainer>
              <StyledHeader>Admins</StyledHeader>
              <span>{sampleEventAdmins}</span>
            </SelectedSiteContentContainer>
          </SelectedSiteMetricsCardContainer>
          <SelectedSiteMetricsCardContainer>
            <BiggerIconGlobe />
            <SelectedSiteContentContainer>
              <StyledHeader>Organizations</StyledHeader>
              <span>{sampleEventOrganizations}</span>
            </SelectedSiteContentContainer>
          </SelectedSiteMetricsCardContainer>
          <SelectedSiteMetricsCardContainer>
            <StyledSvgContainer>
              <img src={coralReefSvg} alt="coral reef" />
            </StyledSvgContainer>
            <SelectedSiteContentContainer>
              <StyledHeader>Reef Habitat</StyledHeader>
              <StyledReefContainer>
                <StyledReefRow>
                  <StyledReefItemBold>Reef Zone</StyledReefItemBold>
                  <StyledReefItem>{selectedSampleEvent.reef_zone}</StyledReefItem>
                </StyledReefRow>
                <StyledReefRow>
                  <StyledReefItemBold>Reef Type</StyledReefItemBold>
                  <StyledReefItem>{selectedSampleEvent.reef_type}</StyledReefItem>
                </StyledReefRow>
                <StyledReefRow>
                  <StyledReefItemBold>Reef Exposure</StyledReefItemBold>
                  <StyledReefItem>{selectedSampleEvent.reef_exposure}</StyledReefItem>
                </StyledReefRow>
              </StyledReefContainer>
            </SelectedSiteContentContainer>
          </SelectedSiteMetricsCardContainer>
          <SelectedSiteMetricsCardContainer>
            <BiggerIconText />
            <SelectedSiteContentContainer>
              <StyledHeader>Notes</StyledHeader>
              <span>{selectedSampleEvent.site_notes}</span>
            </SelectedSiteContentContainer>
          </SelectedSiteMetricsCardContainer>
        </>
      )}
    </>
  ) : null

  return (
    <>
      {selectedSiteHeader}
      <SelectedSiteActionBar>
        {getIsSiteSelected() && isMapView ? (
          <ButtonSecondary onClick={() => zoomToSelectedSite({ displayedProjects, map })}>
            <ZoomToSiteIcon /> &nbsp;Zoom
          </ButtonSecondary>
        ) : null}
        <ButtonSecondary onClick={handleClearSelectedSampleEvent}>
          <IconClose /> Clear
        </ButtonSecondary>
      </SelectedSiteActionBar>
      {selectedSiteBody}
    </>
  )
}

SelectedSiteMetrics.propTypes = {
  view: PropTypes.oneOf(['mapView', 'tableView']).isRequired,
  selectedSampleEvent: PropTypes.object.isRequired,
  setSelectedSampleEvent: PropTypes.func.isRequired,
}
