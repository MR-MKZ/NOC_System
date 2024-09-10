import { saveNotication } from "../models/notificationModel.js";
import { getPackNotifications } from "../models/notificationModel.js";
import { NotFoundException } from "../utils/customException.js";
import { handleError } from "../utils/errorHandler.js";

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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 5;
    const packId = parseInt(req.params.id)

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const items = await getPackNotifications(packId, req.query.page === "off" ? "off" : skip, take)

    if (req.query.page == "off") {
      if (items.length === 0) {
        throw new NotFoundException({
          msg: `pack ${packId} not found.`
        })
      }

      return items
    }

    const notifications = items.notifications

    const totalItems = items.total
    const totalPages = Math.ceil(totalItems / pageSize);

    if (notifications.length > 0 && page > totalPages) {
      throw new NotFoundException({
        msg: `page ${page} not found.`
      })
    }

    if (notifications.length === 0) {
      throw new NotFoundException({
        msg: `pack ${packId} not found.`
      })
    }

    return {
      page: page,
      pageSize: notifications.length,
      totalItems: totalItems,
      totalPages: totalPages,
      notifications: notifications,
    }
  } catch (error) {
    handleError(error, "notificationService", "sendNotification")
  }
}