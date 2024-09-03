import capitalize from "../utils/capitalize.js";
import { sendIncidentPackService, sendPackService, setPackPriority } from "../services/packService.js";
import { sendNotificationService } from "../services/notificationService.js";

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendPacks = async (req, res) => {
    let packs;
    try {
        packs = await sendPackService(req, res);
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }

    return res.status(200).json(packs || [])
};

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendIncidentPacks = async (req, res) => {
    try {
        await sendIncidentPackService(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendNotifications = async (req, res) => {
    try {
        await sendNotificationService(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handlePackPriority = async (req, res) => {
    try {
        let { id, priority } = req.body;
        id = Number(id) || undefined
        priority = capitalize(priority)

        await setPackPriority(id, priority)
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }

    return res.status(200).json({
        message: "Priority changed successfully"
    });
}

export default {
    handleSendPacks,
    handleSendIncidentPacks,
    handleSendNotifications,
    handlePackPriority
};
