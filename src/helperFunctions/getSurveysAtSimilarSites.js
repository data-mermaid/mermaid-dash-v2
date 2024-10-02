const getCoordinateString = (survey) => {
  const { latitude, longitude } = survey
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`
}

export const getSurverysAtSimilarSites = ({ projectData, surveyToCompareTo }) => {
  const allSurveys = projectData.flatMap((project) => {
    return project.records
  })
  const surveysAtASimilarLocation = allSurveys.filter(
    (survey) => getCoordinateString(survey) === getCoordinateString(surveyToCompareTo),
  )

  return surveysAtASimilarLocation
}
