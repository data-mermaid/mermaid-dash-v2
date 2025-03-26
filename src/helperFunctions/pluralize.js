export const pluralizeWordWithCount = (count, singular, plural = `${singular}s`) =>
  `${Math.round(count).toLocaleString()} ${Math.round(count) === 1 ? singular : plural}`

export const pluralizeWord = (count, singular, plural = `${singular}s`) => {
  return `${Math.round(count) === 1 ? singular : plural}`
}
