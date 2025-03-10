import { URL_PARAMS } from '../constants/constants'

export const zoomToSelectedSite = ({ displayedProjects, map }) => {
  const queryParams = new URLSearchParams(location.search)

  if (!map || !displayedProjects || !queryParams) {
    return
  }

  if (queryParams.has(URL_PARAMS.SAMPLE_EVENT_ID)) {
    const sample_event_id = queryParams.get(URL_PARAMS.SAMPLE_EVENT_ID)
    const foundSampleEvent = displayedProjects
      .flatMap((project) => project.records)
      .find((record) => record.sample_event_id === sample_event_id)
    if (!foundSampleEvent) {
      return
    }
    const { latitude, longitude } = foundSampleEvent
    map.setCenter([longitude, latitude])
    map.setZoom(17)
  }
}

export const getIsSiteSelected = () => {
  const queryParams = new URLSearchParams(location.search)

  return queryParams.has(URL_PARAMS.SAMPLE_EVENT_ID)
}
