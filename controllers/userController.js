import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import userModel from "../models/userModel.js";
import userService from "../services/userService.js"
import { ServerException } from "../utils/customException.js";
import paginate from "../utils/paginator.js"
import { returnError } from "../utils/errorHandler.js";


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
        return returnError(error, res)
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
        
        await userService.deleteUser(userId)
    } catch (error) {
        return returnError(error, res)
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
        return returnError(error, res)
    }

    return res.json({
        message: "User updated successfully",
        data: newUser
    })
}

/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getAllUsers = async (req, res) => {
    let users;
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 5;
        const role = req.query.role
        const team = req.query.team

        users = await userService.allUsers(role, team, page, pageSize, req.query.page)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json(users)
}

/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getUser = async (req, res) => {
    let user;
    try {
        const userId = parseInt(req.params.id)

        user = await userService.getUser(userId)
    } catch (error) {
        return returnError(error, res)
    }

    return res.status(200).json(user)
}

/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getCurrentUser = async (req, res) => {
    let user;
    try {
        let userId = req.user.userId
        user = await userService.getCurrentUser(userId)
    } catch (error) {
       return returnError(error, res)
    }

    return res.status(200).json(user)
}

export default {
    createUser,
    deleteUser,
    updateUser,
    getAllUsers,
    getUser,
    getCurrentUser
}