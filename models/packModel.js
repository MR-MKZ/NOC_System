import { prismaClientInstance as prisma } from "../config/database.js";
import paginate from "../utils/paginator.js"

/**
 * 
 * @typedef {'Alert' | 'Resolved' | 'Pending' | 'InProgress' | 'Done'} PackStatus
 */

export const createPack = async ({ fingerprint }) => {
  const pack = await prisma.alertPack.create({
    data: {
      fingerprint: fingerprint,
    },
  });

  return pack;
};

export const getPack = async ({ id, fingerprint }) => {
  let pack;
  if (id) {
    pack = await prisma.alertPack.findFirst({
      where: {
        id: id,
      },
    });
  } else if (fingerprint) {
    pack = await prisma.alertPack.findFirst({
      where: {
        fingerprint: fingerprint,
        status: "Alert",
      },
    });
  } else {
    return undefined;
  }

  return pack ? pack : undefined;
};

/**
 * get all packs with some filters
 * @param {PackStatus} packStatus 
 * @param {number} skip 
 * @param {number} take 
 * @returns alert pack
 */
export const getAllPacks = async (packStatus, skip, take) => {
  let packs;
  let total;

  total = await prisma.alertPack.count({
    where: {
      status: packStatus
    }
  })

  packs = await prisma.alertPack.findMany({
    where: {
      status: packStatus,
    },
    orderBy: {
      id: "desc"
    },
    include: {
      notifications: {
        orderBy: {
          receive_time: 'desc',
        },
        select: {
          service: true,
          text: true,
          alert_create_time: true,
          receive_time: true
        },
        take: 1,
      },
    },
  });

  return packs ? {
    packs: packs,
    total: total
  } : undefined
};

export const closePack = async ({ id }) => {
  return await prisma.alertPack.update({
    where: {
      id: id,
    },
    data: {
      status: "Resolved",
    },
  });
};
