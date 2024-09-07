import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";
import { BadRequestException, NotFoundException, ServerException } from "../utils/customException.js";
import * as yup from "yup";

const updateTeamValidation = yup.object().shape({
    name: yup.string(),
    headId: yup.number()
})

const deleteTeamValidation = yup.number()

const addUserValidation = yup.object().shape({
    userId: yup.number().required("User id is required"),
    teamId: yup.number().required("Team id is required")
})

const createTeam = async (name, head_id) => {
    try {
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
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new BadRequestException({
                    msg: "Team name must be unique"
                })
            }
        } else if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'createTeam',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const updateTeam = async (id, data) => {
    try {
        let validatedData = await updateTeamValidation.validate(data)
        let updatedData = {}

        if (validatedData.headId) {
            let head = await userModel.findById(validatedData.headId)

            if (!head)
                throw new BadRequestException({
                    msg: "User doesn't exist"
                })

            if (head.role_id != 3)
                throw new BadRequestException({
                    msg: "User must have Head role"
                })

            if (head.team.length > 0)
                throw new BadRequestException({
                    msg: "User already added to a team"
                })

            updatedData.head_id = validatedData.headId
        }

        if (validatedData.name)
            updatedData.name = validatedData.name

        return await teamModel.updateById(id, updatedData)
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validtion error",
                data: error.errors
            })
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundException({
                    msg: "Team not found"
                })
            }
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message
            })
        } else if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'updateTeam',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const deleteTeam = async (id) => {
    try {
        await deleteTeamValidation.validate(id)

        return await teamModel.deleteById(id)
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundException({
                    msg: "Team not found"
                })
            }
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'deleteTeam',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
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
        if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundException({
                    msg: "Team not found"
                })
            }
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'addUser',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
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
        if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                console.log(error.meta);
                
                throw new NotFoundException({
                    msg: `Team not found`
                })
            }
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message
            })
        } else if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'removeUser',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const allTeams = async (skip, take) => {
    try {
        return await teamModel.all(skip, take);
    } catch (error) {
        console.log(error);
        throw new ServerException({
            msg: 'Internal server error, please try again later.',
            data: {
                meta: {
                    location: 'teamService',
                    operation: 'allTeams',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
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