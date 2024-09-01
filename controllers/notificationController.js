
import { sendIncidentPackService, sendPackService } from "../services/packService.js";
import { sendNotificationService } from "../services/notificationService.js";

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendPacks = async (req, res) => {
    try {
        await sendPackService(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
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

export default {
    handleSendPacks,
    handleSendIncidentPacks,
    handleSendNotifications
};
