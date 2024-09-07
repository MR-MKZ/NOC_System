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
    let team;
    try {
        const teamId = parseInt(req.params.id)
        const userId = parseInt(req.body.userId)

        team = await teamService.addUser(teamId, userId)
    } catch (error) {
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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

        const items = await teamService.allTeams(skip, take)

        teams = items.teams
        const totalItems = items.total
        const totalPages = Math.ceil(totalItems / pageSize);

        if (teams.length > 0 && page > totalPages) {
            return res.status(404).json({
                message: `page ${page} not found.`
            })
        }

        for (let team of teams) {
            delete team["head_id"]
        }

        return res.status(200).json({
            page: page,
            pageSize: teams.length,
            totalItems: totalItems,
            totalPages: totalPages,
            teams: teams,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }
}

export default {
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    allTeams
}