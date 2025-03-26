export const formatProjectDataHelper = (project) => {
  const { records } = project
  const data = {
    years: new Set(),
    countries: new Set(),
    organizations: project.tags?.map((tag) => tag.name) || [],
    surveyCount: records.length,
    transects: 0,
  }

  records.forEach((record) => {
    data.years.add(record.sample_date.substring(0, 4))
    data.countries.add(record.country_name)
    const sumOfSampleUnitCounts = Object.values(record.protocols).reduce((sum, protocol) => {
      return sum + protocol.sample_unit_count
    }, 0)
    data.transects += sumOfSampleUnitCounts
  })

  const years = [...data.years].sort((a, b) => a.localeCompare(b))
  const formattedDateRange =
    years.length === 0
      ? ''
      : years.length === 1
        ? years[0]
        : `${years[0]}-${years[years.length - 1]}`
  const countries = [...data.countries].sort((a, b) => a.localeCompare(b)).join(', ')
  const organizations = [...data.organizations.sort((a, b) => a.localeCompare(b))].join(', ')

  return {
    projectName: project.project_name,
    formattedDateRange,
    countries,
    organizations: organizations,
    surveyCount: data.surveyCount,
    transects: data.transects,
  }
}
