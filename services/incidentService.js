import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/customException.js"
import incidentModel from "../models/incidentModel.js"
import * as yup from "yup";

const createIncidentSchema = yup.object().shape({
    packId: yup.number().required("Pack id is required"),
    teamId: yup.number().required("Team id is required"),
    notifications: yup.array().of(
        yup.number().positive().required()
    ).min(1, 'Notification must contain at least 1 item').required("Notification is required")
})

const assignIncidentSchema = yup.object().shape({
    packId: yup.number().required("Pack id is required"),
    headId: yup.number().required("Pack id is required"),
    masterMember: yup.number().required("Master member id is required"),
    members: yup.array().of(
        yup.number()
            .typeError("Each member must be a number")
            .positive("Each member must be a positive number")
            .integer("Each member must be an integer")
            .required("Member id is required")
            .strict()
    )
})

const resolveIncidentSchema = yup.object().shape({
    packId: yup.number().required("pack id id is required"),
    userId: yup.number().required("user id id is required")
})


const createIncident = async (packId, teamId, notifications) => {
    try {
        await createIncidentSchema.validate({ packId, teamId, notifications })

        return await incidentModel.create(packId, teamId, notifications)
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message
            })
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message
            })
        } else if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException({
                msg: error.message
            })
        } else if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'incidentService',
                    operation: 'createIncident',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const assignIncident = async (packId, headId, masterMember, members) => {
    try {
        let validatedData = await assignIncidentSchema.validate({ packId, headId, masterMember, members })

        return await incidentModel.assignToMember(validatedData.packId, validatedData.headId, validatedData.masterMember, validatedData.members)
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message,
                data: error.data
            })
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message,
                data: error.data
            })
        } else if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException({
                msg: error.message
            })
        } else if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'incidentService',
                    operation: 'assignIncident',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const resolveIncident = async (packId, userId) => {
    try {
        let validatedData = await resolveIncidentSchema.validate({ packId, userId })

        return await incidentModel.resolveById(validatedData.packId, validatedData.userId)
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message,
                data: error.data
            })
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException({
                msg: error.message,
                data: error.data
            })
        } else if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException({
                msg: error.message
            })
        } else if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        }
        console.log(error);
        throw new ServerException({
            msg: "Internal server error. please try again later",
            data: {
                meta: {
                    location: 'incidentService',
                    operation: 'resolveIncident',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

export default {
    createIncident,
    assignIncident,
    resolveIncident
}