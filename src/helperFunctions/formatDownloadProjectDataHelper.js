import { DOWNLOAD_METHODS } from '../constants/constants'

export const formatDownloadProjectDataHelper = (
  project,
  isMemberOfProject,
  selectedMethod,
  selectedDataSharing,
) => {
  const methodDataSharing = DOWNLOAD_METHODS[selectedMethod]?.policy
  const dataSharingPolicy = project[methodDataSharing]
  const surveyCount = project.records.length

  if (isMemberOfProject) {
    return {
      projectId: project.project_id,
      projectName: project.project_name,
      surveyCount,
      metaData: true,
      surveyData: true,
      observationData: true,
      dataSharingPolicy,
    }
  }

  const isRestricted =
    surveyCount === 0 ||
    (selectedDataSharing === 'public' &&
      (dataSharingPolicy === 'public summary' || dataSharingPolicy === 'private')) ||
    (selectedDataSharing === 'public summary' && dataSharingPolicy === 'private')

  if (isRestricted) {
    return {
      projectId: project.project_id,
      projectName: project.project_name,
      surveyCount,
      metaData: false,
      surveyData: false,
      observationData: false,
      dataSharingPolicy,
    }
  }

  const sharingPermissions = {
    private: { metaData: true, surveyData: false, observationData: false },
    'public summary': { metaData: true, surveyData: true, observationData: false },
    public: { metaData: true, surveyData: true, observationData: true },
  }

  return {
    projectId: project.project_id,
    projectName: project.project_name,
    surveyCount,
    ...sharingPermissions[selectedDataSharing],
    dataSharingPolicy,
  }
}
