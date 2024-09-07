import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import userModel from "../models/userModel.js";
import userService from "../services/userService.js"
import { ServerException } from "../utils/customException.js";
import paginate from "../utils/paginator.js"


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
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
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

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const items = await userService.allUsers(role, team)

        users = items.users
        const totalItems = items.total
        const totalPages = Math.ceil(totalItems / pageSize);

        if (users.length > 0 && page > totalPages) {
            return res.status(404).json({
                message: `page ${page} not found.`
            })
        }

        for (let user of users) {
            delete user["password"]
            delete user["role_id"]
        }

        return res.status(200).json(req.query.page == "off" ? items.users : paginate(items.users, page, pageSize, "users"));
    } catch (error) {
        console.log(error);

        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }
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
        return res.status(error.code).json({
            message: error.message,
            data: error.data
        })
    }

    res.status(200).json(user)
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
        user = await userModel.findById(userId)
        delete user["password"]
        delete user["role_id"]
    } catch (error) {
        console.log(error);
        throw new ServerException({
            msg: 'Internal server error, please try again later.',
            data: {
                meta: {
                    location: 'userService',
                    operation: 'getUser',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
    res.status(200).json(user)
}

export default {
    createUser,
    deleteUser,
    updateUser,
    getAllUsers,
    getUser,
    getCurrentUser
}