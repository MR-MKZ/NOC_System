import { parseAlertItem } from "./parseService.js";
import { handlePack } from "./packService.js";
import {
  prepareNotificationData,
  saveNotification,
} from "./notificationService.js";

export async function processAlerts(alerts, status, orgId, isTest) {
  if (isTest) return null;

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
    }
  }
}
