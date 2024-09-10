import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";
import { BadRequestException, NotFoundException, ServerException } from "../utils/customException.js";
import { updateTeamValidation, deleteTeamValidation, addUserValidation } from "../utils/schema.js";
import { handleError } from "../utils/errorHandler.js"

const createTeam = async (name, head_id) => {
    try {
        if (!name || !head_id) {
            throw new BadRequestException({
                msg: "team name and head id are required"
            })
        }

        if (isNaN(Number(head_id)))
            throw new BadRequestException({
                msg: "headId must be number"
            })

        let head = await userModel.findById(head_id)

        if (!head)
            throw new BadRequestException({
                msg: "User doesn't exist"
            })

        if (![2, 3].includes(head.role_id))
            throw new BadRequestException({
                msg: "User must have Head role"
            })

        let team = await teamModel.create({ name, head_id })
        await userModel.addTeam(head_id, team.id)
        return await teamModel.findById(team.id)
    } catch (error) {
        handleError(error, "teamService", "createTeam")
    }
}

const updateTeam = async (id, data) => {
    try {
        if (!data) {
            throw new BadRequestException({
                msg: "data is required for editing team"
            })
        }

        let validatedData = await updateTeamValidation.validate(data)
        let updatedData = {}

        if (validatedData.headId) {
            let head = await userModel.findById(validatedData.headId)

            if (!head)
                throw new BadRequestException({
                    msg: "User doesn't exist"
                })

            if (![2, 3].includes(head.role_id))
                throw new BadRequestException({
                    msg: "User must have Head role"
                })

            if (head.team?.length > 0)
                throw new BadRequestException({
                    msg: "User already added to a team"
                })

            updatedData.head_id = validatedData.headId
        }

        if (validatedData.name)
            updatedData.name = validatedData.name

        let oldHead = await teamModel.findById(id)

        if (oldHead.head_id == updatedData.head_id)
            throw new BadRequestException({
                msg: "Old head can't set as new head"
            })
        
        if (updatedData.head_id)
            await userModel.removeTeam(oldHead.head_id, id)
        
        let team = await teamModel.updateById(id, updatedData)
        
        if (updatedData.head_id)
            await userModel.addTeam(updatedData.head_id, team.id)
        
        return await teamModel.findById(team.id)
    } catch (error) {
        console.log(error);
        
        handleError(error, "teamService", "updateTeam")
    }
}

const deleteTeam = async (id) => {
    try {
        await deleteTeamValidation.validate(id)

        return await teamModel.deleteById(id)
    } catch (error) {
        handleError(error, "teamService", "deleteTeam")
    }
}

const addUser = async (teamId, userId) => {
    try {
        await addUserValidation.validate({
            userId,
            teamId
        })

        let user = await userModel.findById(userId)

        if (!user)
            throw new NotFoundException({
                msg: "User not found"
            })

        await userModel.addTeam(userId, teamId)

        return await teamModel.findById(teamId)
    } catch (error) {
        handleError(error, "teamService", "addUser")
    }
}

const removeUser = async (teamId, userId) => {
    try {
        await addUserValidation.validate({
            userId,
            teamId
        })

        let user = await userModel.findById(userId)
        let team = await teamModel.findById(teamId)

        if (!team)
            throw new NotFoundException({
                msg: "Team not found"
            })

        if (!user)
            throw new NotFoundException({
                msg: "User not found"
            })

        if (user.team.id != team.id)
            throw new NotFoundException({
                msg: "User is not in this team"
            })

        if (user.id == team.head_id)
            throw new BadRequestException({
                msg: "You can't remove team head"
            })

        await userModel.removeTeam(userId, teamId)

        return await teamModel.findById(teamId)
    } catch (error) {
        handleError(error, "teamService", "removeUser")
    }
}

const allTeams = async (skip, take, reqPage, pageSize, page) => {
    let teams;
    try {
        const items = await teamModel.all(reqPage == "off" ? "off" : skip, take)

        if (reqPage != "off") {
            teams = items.teams
            const totalItems = items.total
            const totalPages = Math.ceil(totalItems / pageSize);

            if (teams.length > 0 && page > totalPages) {
                throw new NotFoundException({
                    msg: `page ${page} not found.`
                })
            }

            for (let team of teams) {
                delete team["head_id"]
            }

            return {
                page: page,
                pageSize: teams.length,
                totalItems: totalItems,
                totalPages: totalPages,
                teams: teams,
            }
        } else {
            return {
                teams: items
            }
        }
    } catch (error) {
        handleError(error, "teamService", "allTeams")
    }
}

export default {
    createTeam,
    updateTeam,
    deleteTeam,
    addUser,
    removeUser,
    allTeams
}