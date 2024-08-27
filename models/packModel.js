import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
