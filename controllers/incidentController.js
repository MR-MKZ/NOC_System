import incidentService from "../services/incidentService.js"
import { returnError } from "../utils/errorHandler.js"

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
        return returnError(error, res)
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
    try {
        const packId = req.body.packId
        const headId = parseInt(req.user.userId)
        const masterMember = req.body.masterMember
        const members = req.body.members

        await incidentService.assignIncident(packId, headId, masterMember, members)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Incident assigned to member successfully"
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const resolveIncident = async (req, res) => {
    let data;
    try {
        const packId = req.params.id
        const userId = parseInt(req.user.userId)

        data = await incidentService.resolveIncident(packId, userId)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Incident resolved successfully",
        data: data
    })
}

export default {
    createIncident,
    assignIncident,
    resolveIncident
}