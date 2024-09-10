import { getPack, createPack, closePack, getAllIncidents, updatePackById } from "../models/packModel.js";
import { getAllPacks } from "../models/packModel.js";
import { NotFoundException } from "../utils/customException.js";
import paginate from "../utils/paginator.js";
import { packPrioritySchema } from "../utils/schema.js";
import { handleError } from "../utils/errorHandler.js";

export async function handlePack(fingerprint, status, isTest) {
  if (isTest) return null;

  let pack = await getPack({ fingerprint });

  if (status == "firing" && !pack) {
    pack = await createPack({ fingerprint });
  } else if (status == "resolved" && pack) {
    await closePack({ id: pack.id });
  }

  return pack;
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function sendPackService(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 5;
    const status = req.query.status || "Alert";
    const startId = parseInt(req.query.start_id) || 1;
    const packId = parseInt(req.body.packId)

    let packs;

    if (packId && !isNaN(packId)) {
      packs = await getPack({ id: packId })

      return packs
    }

    if (!packId) {
      const items = await getAllPacks(status, startId)

      packs = items.packs

      packs.sort((a, b) => {
        const dateA = new Date(a.notifications[0].receive_time);
        const dateB = new Date(b.notifications[0].receive_time);
        return dateB - dateA;
      });

      const totalItems = items.total
      const totalPages = Math.ceil(totalItems / pageSize);

      if (packs.length > 0 && page > totalPages) {
        throw new NotFoundException({
          msg: `page ${page} not found.`
        })
      }

      return req.query.page == "off" ? packs : paginate(packs, page, pageSize, "packs")
    }
  } catch (error) {
    handleError(error, "packService", "sendPack")
  }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function sendIncidentPackService(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 5;
    const headId = parseInt(req.user.userId)
    const role = req.user?.role?.name

    const items = await getAllIncidents(headId, role)

    const packs = items.packs

    packs.sort((a, b) => {
      const dateA = new Date(a.notifications[0].receive_time);
      const dateB = new Date(b.notifications[0].receive_time);
      return dateB - dateA;
    });

    const totalItems = items.total
    const totalPages = Math.ceil(totalItems / pageSize);

    if (packs.length > 0 && page > totalPages) {
      throw new NotFoundException({
        msg: `page ${page} not found.`
      })
    }

    return req.query.page == "off" ? packs : paginate(packs, page, pageSize, "incidents")
  } catch (error) {
    handleError(error, "packService", "sendIncidentPack")
  }
}

/**
 * handle setting priority for pack
 * @param {number} packId 
 * @param {"Low" | "Medium" | "High"} priority 
 */
export async function setPackPriority(packId, priority) {
  try {
    await packPrioritySchema.validate({
      id: packId,
      priority: priority
    })

    await updatePackById({
      id: packId,
      data: {
        priority: priority
      }
    })
  } catch (error) {
    handleError(error, "packService", "setPackPriority")
  }
}