
import { sendPackService } from "../services/packService.js";
import { sendNotificationService } from "../services/notificationService.js";

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendPacks = async (req, res) => {
    await sendPackService(req, res);
};

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendNotifications = async (req, res) => {
    await sendNotificationService(req, res);
}

export default {
    handleSendPacks,
    handleSendNotifications
};
