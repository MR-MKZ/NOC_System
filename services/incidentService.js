import { BadRequestException, NotFoundException } from "../utils/customException.js"
import incidentModel from "../models/incidentModel.js"
import * as yup from "yup";

const createIncidentSchema = yup.object().shape({
    packId: yup.number().integer("Pack id must be integer").required("Pack id is required"),
    teamId: yup.number().integer("Team id must be integer").required("Team id is required"),
    notifications: yup.array().of(
        yup.number().integer().positive().required()
    ).min(1, 'Notification must contain at least 1 item').required("Notification is required")
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

const assignIncident = async (packId, masterMemeber, members) => { }

const reportIncident = async (packId, reportData) => { }

export default {
    createIncident,
    assignIncident,
    reportIncident
}