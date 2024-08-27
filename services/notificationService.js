import { saveNotication } from "../models/notificationModel.js";

export function prepareNotificationData(alertData, orgId, packId) {
  return {
    text: alertData.text,
    service: alertData.service,
    serviceAddr: alertData.serviceAddr ? alertData.serviceAddr : "",
    orgId: orgId,
    values: alertData.values,
    alertCreateTime: alertData.startAt,
    resolveTime: null,
    packId: packId,
  };
}

export async function saveNotification(notificationData) {
  await saveNotication(notificationData);
}
