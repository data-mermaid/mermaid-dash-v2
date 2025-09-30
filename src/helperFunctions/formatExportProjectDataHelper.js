import { EXPORT_METHODS } from '../constants/constants'

const getMethodSurveyCount = (projectRecords, selectedMethod) =>
  projectRecords.filter((record) => record.protocols?.[selectedMethod]).length

const getSummaryAndObservationDataPermission = (dataSharingPolicy, isMemberOfProject) => {
  if (isMemberOfProject) {
    return { summaryData: true, observationData: true }
  }

  const dataPermission = {
    private: { summaryData: false, observationData: false },
    'public summary': { summaryData: true, observationData: false },
    public: { summaryData: true, observationData: true },
  }

  return dataPermission[dataSharingPolicy] || { summaryData: false, observationData: false }
}

export const formatExportProjectDataHelper = (project, isMemberOfProject, selectedMethod) => {
  const methodDataSharing = EXPORT_METHODS[selectedMethod]?.policy
  const dataSharingPolicy = project[methodDataSharing]
  const surveyCount = getMethodSurveyCount(project?.records || [], selectedMethod)
  const summaryAndObservationData = getSummaryAndObservationDataPermission(
    dataSharingPolicy,
    isMemberOfProject,
  )

  return {
    projectId: project.project_id,
    projectName: project.project_name,
    surveyCount,
    dataSharingPolicy,
    ...summaryAndObservationData,
  }
}
