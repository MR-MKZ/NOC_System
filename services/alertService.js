import { parseAlertItem } from "./parseService.js";
import { handlePack } from "./packService.js";
import {
  prepareNotificationData,
  saveNotification,
} from "./notificationService.js";

export async function processAlerts(alerts, status, orgId, isTest) {
  if (isTest) return null;
  
  const aiWebhookData = [];

  for (const alertItem of alerts) {
    const alertData = parseAlertItem(alertItem);
    const pack = await handlePack(alertData.fingerprint, status, isTest);
    
    if (!isTest && pack) {
      const notificationData = prepareNotificationData(
        alertData,
        orgId,
        pack.id
      );
      await saveNotification(notificationData);
      aiWebhookData.push(prepareAiWebhookData(alertData, status));
    }
  }

  return aiWebhookData;
}

export function prepareAiWebhookData(alertData, status) {
  return {
    Title: alertData.text,
    Service: alertData.service,
    Status: status,
    Value: alertData.values,
    StartAt: alertData.startAt,
    EndAt: alertData.endAt,
  };
}
