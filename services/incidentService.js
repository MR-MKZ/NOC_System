import incidentModel from "../models/incidentModel.js"
import { handleError } from "../utils/errorHandler.js"; 
import { createIncidentSchema, assignIncidentSchema, resolveIncidentSchema } from "../utils/schema.js";

const createIncident = async (packId, teamId, notifications) => {
    try {
        await createIncidentSchema.validate({ packId, teamId, notifications })

        return await incidentModel.create(packId, teamId, notifications)
    } catch (error) {
        handleError(error, "incidentService", "createIncident")
    }
}

const assignIncident = async (packId, headId, masterMember, members) => {
    try {
        let validatedData = await assignIncidentSchema.validate({ packId, headId, masterMember, members })

        return await incidentModel.assignToMember(validatedData.packId, validatedData.headId, validatedData.masterMember, validatedData.members)
    } catch (error) {
        handleError(error, "incidentService", "assignIncident")
    }
}

const resolveIncident = async (packId, userId) => {
    try {
        let validatedData = await resolveIncidentSchema.validate({ packId, userId })

        return await incidentModel.resolveById(validatedData.packId, validatedData.userId)
    } catch (error) {
        handleError(error, "incidentService", "resolveIncident")
    }
}

export default {
    createIncident,
    assignIncident,
    resolveIncident
}