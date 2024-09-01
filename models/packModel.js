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
 * @returns alert pack
 */
export const getAllPacks = async (packStatus) => {
  let packs;
  let total;

  total = await prisma.alertPack.count({
    where: {
      status: packStatus,
      OR: [
        { type: "Alert" },
        { type: null }
      ]
    }
  })

  packs = await prisma.alertPack.findMany({
    where: {
      status: packStatus,
      OR: [
        { type: "Alert" },
        { type: null }
      ]
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
    }
  });

  return packs ? {
    packs: packs,
    total: total
  } : undefined
};

export const getAllIncidents = async () => {
  let packs;
  let total;

  total = await prisma.alertPack.count({
    where: {
      status: {
        notIn: ["Done", "Resolved"]
      },
      type: "Incident"
    }
  })

  packs = await prisma.alertPack.findMany({
    where: {
      status: {
        notIn: ["Done", "Resolved"]
      },
      type: "Incident"
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
    }
  })

  return packs ? {
    packs: packs,
    total: total
  } : undefined
}

export const closePack = async ({ id }) => {
  return await prisma.alertPack.update({
    where: {
      id: id,
    },
    data: {
      status: "Resolved",
      end_at: new Date()
    },
  });
};

export const updatePackById = async ({ id, data }) => {
  return await prisma.alertPack.update({
    where: {
      id: id
    },
    data: data
  })
}
