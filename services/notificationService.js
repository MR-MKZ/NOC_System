import { saveNotication } from "../models/notificationModel.js";
import { getPackNotifications } from "../models/notificationModel.js";

export function prepareNotificationData(alertData, orgId, packId) {
  return {
    text: alertData.text,
    service: alertData.service,
    serviceAddr: alertData.serviceAddr ? alertData.serviceAddr : "",
    orgId: orgId,
    values: alertData.values,
    alertCreateTime: alertData.startAt,
    resolveTime: alertData.endAt,
    packId: packId,
  };
}

export async function saveNotification(notificationData) {
  await saveNotication(notificationData);
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function sendNotificationService(req, res) {
  try {
    // Get page and size from query parameters (with defaults)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 5;
    const packId = parseInt(req.params.id)

    // Calculate `skip` and `take`
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch items with pagination
    const items = await getPackNotifications(packId, skip, take)

    const notifications = items.notifications

    // get the total count of items to calculate total pages
    const totalItems = items.total
    const totalPages = Math.ceil(totalItems / pageSize);

    if (notifications.length > 0 && page > totalPages) {
      return res.status(404).json({
        error: `page ${page} not found.`
      })
    }

    if (notifications.length === 0) {
      return res.status(404).json({
        error: `pack ${packId} not found.`
      })
    }

    return res.status(200).json({
      page: page,
      pageSize: notifications.length,
      totalItems: totalItems,
      totalPages: totalPages,
      notifications: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}