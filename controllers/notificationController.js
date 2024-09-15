import capitalize from "../utils/capitalize.js";
import { sendIncidentPackService, sendPackService, setPackPriority } from "../services/packService.js";
import { sendNotificationService } from "../services/notificationService.js";
import { handleError, returnError } from "../utils/errorHandler.js";
import charts from "../utils/charts/charts.js"
import aiInterface from "../interfaces/AiInterface.js";

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
        return returnError(error, res)
    }

    return res.status(200).json(packs || [])
};

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendIncidentPacks = async (req, res) => {
    let packs;
    try {
        packs = await sendIncidentPackService(req, res);
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json(packs)
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSendNotifications = async (req, res) => {
    let notifications;
    try {
        notifications = await sendNotificationService(req, res);
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json(notifications)
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
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Priority changed successfully"
    });
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const openNotificationsOverview = async (req, res) => {
    let data;
    try {
        data = await charts.getOpenAlertsIncidentsCount()
    } catch (error) {
        try {
            handleError(error, "teamController", "topTeams")
        } catch (error) {
            return returnError(error, res)
        }
    }

    return res.status(200).json(data)
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const allNotificationsOverview = async (req, res) => {
    let data;
    try {
        data = await charts.getAlertIncidentCountOnDate()
    } catch (error) {
        try {
            handleError(error, "teamController", "topTeams")
        } catch (error) {
            return returnError(error, res)
        }
    }

    return res.status(200).json(data)
}

/**
 * fetch, paginate and send notification to user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const predictFeedback = async (req, res) => {
    try {
        const packId = parseInt(req.params.id)
        const feedback = req.body.feedback

        if (packId)
            await aiInterface.sendFeedback(packId, feedback)
    } catch (error) {
        try {
            handleError(error, "notificationController", "predictFeedback")
        } catch (error) {
            return returnError(error, res)
        }
    }

    return res.status(200).json({
        message: "Feedback submitted successfully"
    })
}

export default {
    handleSendPacks,
    handleSendIncidentPacks,
    handleSendNotifications,
    handlePackPriority,
    openNotificationsOverview,
    allNotificationsOverview,
    predictFeedback
};
