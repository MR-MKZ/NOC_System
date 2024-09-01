import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import userModel from "../models/userModel.js";
import userService from "../services/userService.js"


/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const createUser = async (req, res) => {
    let user;
    try {
        user = await userService.createUser(req, res)
    } catch (error) {
        return res.status(error.code).json({
            error: error.message,
            data: error.data
        })
    }
    return res.status(201).json({
        message: "user created successfully",
        data: user
    })
}

/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        await userModel.deleteById(userId)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({
                    message: "User not found"
                })
            }
        } else if (error instanceof PrismaClientValidationError) {
            return res.status(400).json({
                message: "user id should be number"
            })
        } else {
            console.log(error);
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    return res.json({
        message: "User deleted successfully"
    })
}

/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const updateUser = async (req, res) => {
    let newUser;
    try {
        newUser = await userService.updateUser(req, res);
        delete newUser["password"]
    } catch (error) {
        console.log(error);
        
        return res.status(error.code).json({
            error: error.message,
            data: error.data
        })
    }
    return res.json({
        message: "User updated successfully",
        data: newUser
    })
}

// TODO: update user validation is not completed. [Not Secure]

export default {
    createUser,
    deleteUser,
    updateUser
}