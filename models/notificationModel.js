import { prismaClientInstance as prisma } from "../config/database.js";

export const saveNotication = async ({
  text,
  service,
  serviceAddr,
  receiveTime,
  alertCreateTime,
  resolveTime,
  values,
  orgId,
  packId,
}) => {
  return await prisma.notification.create({
    data: {
      text: text,
      service: service,
      service_addr: serviceAddr,
      receive_time: receiveTime,
      alert_create_time: alertCreateTime,
      resolve_time: resolveTime,
      values: values,
      org_id: orgId,
      pack_id: packId
    }
  });
};

export const getPackNotifications = async (packId, skip, take) => {
  let notifications;
  let totalNotifications;  

  if (skip == "off") {
    notifications = await prisma.notification.findMany({
      where: {
        pack_id: packId
      },
      orderBy: {
        receive_time: "desc"
      }
    })

    return notifications || undefined
  } else {
    notifications = await prisma.notification.findMany({
      where: {
        pack_id: packId
      },
      orderBy: {
        receive_time: "desc"
      },
      skip: skip,
      take: take
    })

    totalNotifications = await prisma.notification.count({
      where: {
        pack_id: packId
      }
    });

    return notifications ? {
      notifications: notifications,
      total: totalNotifications
    } : undefined
  }
}