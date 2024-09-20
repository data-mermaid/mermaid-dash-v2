export const zoomToSelectedSite = ({ displayedProjects, map }) => {
  const queryParams = new URLSearchParams(location.search)

  if (!map || !displayedProjects || !queryParams) {
    return
  }

  if (queryParams.has('sample_event_id')) {
    const sample_event_id = queryParams.get('sample_event_id')
    const foundSampleEvent = displayedProjects
      .flatMap((project) => project.records)
      .find((record) => record.sample_event_id === sample_event_id)
    if (!foundSampleEvent) {
      return
    }
    const { latitude, longitude } = foundSampleEvent
    map.setCenter([longitude, latitude])
    map.setZoom(18)
  }
}

export const getIsSiteSelected = () => {
  const queryParams = new URLSearchParams(location.search)

  return queryParams.has('sample_event_id')
}
