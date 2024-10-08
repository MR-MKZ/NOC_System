import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException } from "../utils/customException.js";

import userModel from "./userModel.js"

/**
 * 
 * @typedef {'Alert' | 'Resolved' | 'Pending' | 'InProgress' | 'Done' | 'All'} PackStatus
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
      include: {
        notifications: {
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
  } else if (fingerprint) {
    pack = await prisma.alertPack.findFirst({
      where: {
        fingerprint: fingerprint,
        status: {
          in: ["Alert", "Pending", "InProgress"]
        }
      },
      include: {
        notifications: {
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
export const getAllPacks = async (packStatus, startId) => {
  let packs;
  let total;

  const Status = ['Alert', 'Resolved', 'Pending', 'InProgress', 'Done', 'All']

  if (Status.indexOf(packStatus) < 0)
    throw new BadRequestException({
      msg: "status is not valid"
    })

  if (packStatus.toLowerCase() == "all") {
    total = await prisma.alertPack.count()

    packs = await prisma.alertPack.findMany({
      cursor: {
        id: startId
      },
      orderBy: {
        id: "asc"
      },
      include: {
        notifications: {
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
  } else {
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
  }

  return packs ? {
    packs: packs,
    total: total
  } : undefined
};

export const getAllIncidents = async (headId, role) => {
  let packs;
  let total;

  let user = await userModel.findById(headId)

  let query = {
    status: {
      notIn: ["Done", "Resolved"]
    },
    type: "Incident"
  }

  if (!isNaN(headId) && role == "Head") {
    query["assigned_team"] = {
      head_id: headId
    }
  }

  if (user.pack_id) {
    query["id"] = user.pack_id
  }

  if (role == "Team_724" || role == "Head" && user.team_id || user.pack_id) {
    total = await prisma.alertPack.count({
      where: query
    })

    packs = await prisma.alertPack.findMany({
      where: query,
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
        assigned_team: {
          select: {
            id: true,
            name: true,
            head: {
              select: {
                id: true,
                username: true
              }
            },
          },
        },
        master_member: {
          select: {
            id: true,
            username: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
  } else {
    total - 0
    packs = []
  }

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
