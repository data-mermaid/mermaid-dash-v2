export const xAxisUniqueCountLessThanThree = (plotlyData) => {
  return plotlyData.every((data) => {
    const uniqueYears = new Set(data.x)
    return uniqueYears.size < 3
  })
}
