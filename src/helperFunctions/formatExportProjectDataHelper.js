import { EXPORT_METHODS } from '../constants/constants'

const getMethodSurveyCount = (projectRecords, selectedMethod) =>
  projectRecords.filter((record) => record.protocols?.[selectedMethod]).length

const getAccessLevelType = (dataSharingPolicy, isMemberOfProject) => {
  const accessLevelTypes = {
    private: 'metadata',
    'public summary': 'survey',
    public: 'observation',
  }

  if (isMemberOfProject) {
    return 'observation'
  }

  return accessLevelTypes[dataSharingPolicy] || ''
}

export const formatExportProjectDataHelper = (project, isMemberOfProject, selectedMethod) => {
  const methodDataSharing = EXPORT_METHODS[selectedMethod]?.policy
  const dataSharingPolicy = project[methodDataSharing]
  const surveyCount = getMethodSurveyCount(project?.records || [], selectedMethod)
  const accessLevel = getAccessLevelType(dataSharingPolicy, isMemberOfProject)

  return {
    projectId: project.project_id,
    projectName: project.project_name,
    surveyCount,
    accessLevel,
    dataSharingPolicy,
  }
}
