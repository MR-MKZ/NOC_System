import incidentService from "../services/incidentService.js"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const createIncident = async (req, res) => {
    try {
        const packId = req.body.packId
        const teamId = req.body.teamId
        const notifications = req.body.notifications

        await incidentService.createIncident(packId, teamId, notifications)
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }

    return res.status(200).json({
        message: "Incident created successfully"
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const assignIncident = async (req, res) => {

}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const reportIncident = async (req, res) => {

}

export default {
    createIncident,
    assignIncident,
    reportIncident
}