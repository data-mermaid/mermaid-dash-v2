export const getProtocolSurveyCounts = (projectRecords) => {
  if (!projectRecords || projectRecords.length === 0) {
    return {}
  }

  return projectRecords.reduce((acc, record) => {
    const protocols = record?.protocols ?? {}

    Object.keys(protocols).map((protocol) => {
      if (acc[protocol]) {
        acc[protocol] += 1
      } else {
        acc[protocol] = 1
      }
    })

    return acc
  }, {})
}
