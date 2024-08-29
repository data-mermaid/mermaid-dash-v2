export const formatProjectDataHelper = (project) => {
  console.log('project:', project)
  const { records } = project
  const data = {
    years: project.years,
    countries: project.countries.join(', '),
    organizations: project.organizations.join(', '),
    surveyCount: records.length,
    transects: 0,
  }
  console.log('data:', data)

  records.forEach((record) => {
    const sumOfSampleUnitCounts = Object.values(record.protocols).reduce((sum, protocol) => {
      return sum + protocol.sample_unit_count
    }, 0)
    data.transects += sumOfSampleUnitCounts
  })

  const formattedDateRange =
    data.years.length === 0
      ? ''
      : data.years.length === 1
        ? data.years[0]
        : `${data.years[0]}-${data.years[data.years.length - 1]}`

  console.log('formattedDateRange:', formattedDateRange)

  return {
    projectName: project.project_name,
    formattedDateRange,
    countries: data.countries,
    organizations: data.organizations,
    surveyCount: data.surveyCount,
    transects: data.transects,
  }
}
