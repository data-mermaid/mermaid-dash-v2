export const formatProjectDataHelper = (project) => {
  const projectName = project.records[0].project_name
  const years = [
    ...new Set(project.records.map((record) => record.sample_date.substring(0, 4))),
  ].sort((a, b) => a.localeCompare(b))
  const formattedYears = years.length === 1 ? years[0] : `${years[0]}-${years[years.length - 1]}`
  const countries = [...new Set(project.records.map((record) => record.country_name))]
    .sort((a, b) => a.localeCompare(b))
    .join(', ')
  const organizations = [
    ...new Set(project.records.map((record) => record.tags?.map((tag) => tag.name)).flat()),
  ]
    .sort((a, b) => a.localeCompare(b))
    .join(', ')
  const surveyCount = project.records.length
  const transects = project.records.reduce((acc, record) => {
    return (
      acc +
      Object.values(record.protocols).reduce((acc, protocol) => {
        return acc + protocol.sample_unit_count
      }, 0)
    )
  }, 0)
  return { projectName, formattedYears, countries, organizations, surveyCount, transects }
}
