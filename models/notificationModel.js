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

export default {
  saveNotication,
};
