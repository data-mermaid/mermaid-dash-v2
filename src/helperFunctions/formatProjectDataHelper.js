export const formatProjectDataHelper = (project) => {
  const { records } = project
  const data = {
    years: project.years,
    countries: project.countries.join(', '),
    organizations: project.organizations.join(', '),
    surveyCount: records.length,
    transects: 0,
  }

  records.forEach((record) => {
    const sumOfSampleUnitCounts = Object.values(record.protocols).reduce((sum, protocol) => {
      return sum + protocol.sample_unit_count
    }, 0)
    data.transects += sumOfSampleUnitCounts
  })

  const formattedYears =
    data.years.length === 0
      ? ''
      : data.years.length === 1
        ? data.years[0]
        : `${data.years[0]}-${data.years[data.years.length - 1]}`

  return {
    projectName: project.project_name,
    formattedYears,
    countries: data.countries,
    organizations: data.organizations,
    surveyCount: data.surveyCount,
    transects: data.transects,
  }
}
