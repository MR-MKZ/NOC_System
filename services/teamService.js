import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";
import { BadRequestException, ServerException } from "../utils/customException";

const createTeam = async (name, head_id) => {
    try {
        let head = await userModel.findById(head_id)
        
        if (head) 
            return await teamModel.create({ name, head_id })
        else
            throw new BadRequestException({
                msg: "User doesn't exist"
            })
    } catch (error) {
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