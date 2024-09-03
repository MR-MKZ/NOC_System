import teamService from '../services/teamService.js';
import { BadRequestException } from '../utils/customException.js';

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
        if (!teamName || !head_id) {
            throw new BadRequestException({
                msg: "team name and head id are required"
            })
        }
        team = await teamService.createTeam(teamName, head_id)
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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
        if (!data) {
            throw new BadRequestException({
                msg: "data is required for editing team"
            })
        }

        team = await teamService.updateTeam(teamId, data)
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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
    
}

export default {
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember
}