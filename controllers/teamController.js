import teamService from '../services/teamService.js';
import { handleError, returnError } from '../utils/errorHandler.js';

import charts from "../utils/charts/charts.js";

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const createTeam = async (req, res) => {
    let team;
    try {
        const teamName = req.body.name
        const head_id = req.body.headId
        
        team = await teamService.createTeam(teamName, head_id)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Team created successfully",
        data: team
    })
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const updateTeam = async (req, res) => {
    let team;
    try {
        const teamId = parseInt(req.params.id)
        const data = req.body

        team = await teamService.updateTeam(teamId, data)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Team updated successfully",
        data: team
    })
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const deleteTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.id)

        await teamService.deleteTeam(teamId)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "Team deleted successfully"
    })
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const addTeamMember = async (req, res) => {
    let team;
    try {
        const teamId = parseInt(req.params.id)
        const userId = parseInt(req.body.userId)

        team = await teamService.addUser(teamId, userId)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "User added to team successfully",
        team: team
    })
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const removeTeamMember = async (req, res) => {
    try {
        const teamId = parseInt(req.params.id)
        const userId = parseInt(req.body.userId)

        await teamService.removeUser(teamId, userId)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json({
        message: "User removed from team successfully",
    })
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const allTeams = async (req, res) => {
    let teams;
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 5;

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        teams = await teamService.allTeams(skip, take, req.query.page, pageSize, page)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json(teams)
}

/**
 * fetch, paginate and return packs for user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const topTeams = async (req, res) => {
    let data;
    try {
        data = await charts.getTopTeamsIncidentStatus()
    } catch (error) {
        try {
            handleError(error, "teamController", "topTeams")
        } catch (error) {
            return returnError(error, res)
        }
    }

    return res.status(200).json(data)
}

export default {
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    allTeams,
    topTeams
}