import { BadRequestException, NotFoundException } from "../utils/customException.js"
import incidentModel from "../models/incidentModel.js"
import * as yup from "yup";



const createIncident = async (packId, teamId) => {
    try {
        
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw new BadRequestException({
                msg: error.message
            })
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
                    location: 'incidentService',
                    operation: 'createIncident',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

const assignIncident = async (packId, masterMemeber, members) => {}

const reportIncident = async (packId, reportData) => {}

export default {
    createIncident,
    assignIncident,
    reportIncident
}