export const pluralizeWordWithCount = (count, singular, plural = `${singular}s`) =>
  `${count} ${Number(count) === 1 ? singular : plural}`

export const pluralizeWord = (count, singular, plural = `${singular}s`) => {
  return `${Number(count) === 1 ? singular : plural}`
}
