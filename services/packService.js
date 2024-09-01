import { getPack, createPack, closePack, getAllIncidents } from "../models/packModel.js";
import { getAllPacks } from "../models/packModel.js";
import paginate from "../utils/paginator.js";

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
    const status = req.query.status || "Alert"

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch items with pagination
    const items = await getAllPacks(status, skip, take)

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
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