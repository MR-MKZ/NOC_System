import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getPack, createPack, closePack, getAllIncidents, updatePackById } from "../models/packModel.js";
import { getAllPacks } from "../models/packModel.js";
import { BadRequestException, NotFoundException, ServerException } from "../utils/customException.js";
import paginate from "../utils/paginator.js";
import { packPrioritySchema } from "../utils/schema.js";
import * as yup from "yup";

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

    // Fetch items with pagination
    const items = await getAllPacks(status, startId)

    const packs = items.packs

    packs.sort((a, b) => {
      const dateA = new Date(a.notifications[0].receive_time);
      const dateB = new Date(b.notifications[0].receive_time);
      return dateB - dateA; // Newest to oldest
    });

    const totalItems = items.total
    const totalPages = Math.ceil(totalItems / pageSize);

    if (packs.length > 0 && page > totalPages) {
      throw new NotFoundException({
        msg: `page ${page} not found.`
      })
    }

    return req.query.page == "off" ? packs : paginate(packs, page, pageSize)
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      console.log(error.message);

      throw new BadRequestException({
        msg: error.message
      })
    } else if (error instanceof BadRequestException) {
      throw new BadRequestException({
        msg: error.message
      })
    } else {
      console.log(error);
      throw new ServerException({
        msg: "Internal server error, please try again later.",
        data: {
          meta: {
            location: 'packService',
            operation: 'sendPack',
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
          }
        }
      })
    }
  }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function sendIncidentPackService(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.size) || 5;
  const status = req.query.status || "Alert"

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Fetch items with pagination
  const items = await getAllIncidents(status, skip, take)

  const packs = items.packs

  packs.sort((a, b) => {
    const dateA = new Date(a.notifications[0].receive_time);
    const dateB = new Date(b.notifications[0].receive_time);
    return dateB - dateA; // Newest to oldest
  });

  const totalItems = items.total
  const totalPages = Math.ceil(totalItems / pageSize);

  if (packs.length > 0 && page > totalPages) {
    return res.status(404).json({
      error: `page ${page} not found.`
    })
  }

  return res.status(200).json(req.query.page == "off" ? packs : paginate(packs, page, pageSize));
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
    if (error instanceof yup.ValidationError) {
      throw new BadRequestException({
        msg: "data validation error",
        data: error.errors
      })
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundException({
          msg: "Pack not found"
        })
      }
    } else {
      console.log(error);
      throw new ServerException({
        msg: "Internal server error, please try again later.",
        data: {
          meta: {
            location: 'packService',
            operation: 'setPackPriority',
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
          }
        }
      });
    }
  }
}