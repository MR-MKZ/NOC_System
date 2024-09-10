import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import userModel from "../models/userModel.js"
import { BadRequestException, NotFoundException, ServerException } from "../utils/customException.js";
import hashPassword from "../utils/passwordHash.js";
import convertRole from "../utils/convertRole.js";
import { handleError } from "../utils/errorHandler.js"
import paginate from "../utils/paginator.js";
import { userSchema, updateUserSchema, getUserSchema, getAllUsersRoleSchema } from "../utils/schema.js";

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const createUser = async (req, res) => {
    let user;
    try {
        let validatedData = await userSchema.validate(req.body, { abortEarly: false })
        user = await userModel.addUser(validatedData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: [`${error.meta.target} is not unique`]
            })
        }
        handleError(error, "userService", "createUser")
    }
    delete user["password"]
    delete user["role_id"]
    return user
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const updateUser = async (req, res) => {
    try {
        let updatedData = {}
        let { username, password, email, role } = req.body
        const userId = parseInt(req.params.id)

        let user = await userModel.findById(userId)

        if (role && user.team?.length > 0)
            throw new BadRequestException({
                msg: "You can't change role of user who added in a team"
            })

        if (username)
            updatedData.username = username

        if (password)
            updatedData.password = password

        if (email)
            updatedData.email = email

        if (role)
            updatedData.role_id = role

        await updateUserSchema.validate(updatedData)

        if (password)
            updatedData.password = hashPassword(password)

        if (role)
            updatedData.role_id = convertRole(role)

        return await userModel.updateById({
            id: userId,
            updatedData: updatedData
        })
    } catch (error) {
        handleError(error, "userService", "updateUser")
    }
}

const allUsers = async (role, team, page, pageSize, queryPage) => {
    let users;
    try {
        await getAllUsersRoleSchema.validate(role)

        const items = await userModel.all(role, team);

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
        
        return queryPage == "off" ? items.users : paginate(items.users, page, pageSize, "users")
    } catch (error) {
        handleError(error, "userService", "allUsers")
    }
}

const getUser = async (userId) => {
    try {
        await getUserSchema.validate(userId)

        return await userModel.findById(userId)
    } catch (error) {
        handleError(error, "userService", "getUser")
    }
}

const deleteUser = async (userId) => {
    try {
        if (isNaN(userId)) {
            throw new BadRequestException({
                msg: "User id must be number"
            })
        }
        await userModel.deleteById(userId)
    } catch (error) {
        handleError(error, "userService", "deleteUser")
    }
}

const getCurrentUser = async (userId) => {
    try {
        let user = await userModel.findById(userId)
        delete user["password"]
        delete user["role_id"]

        return user
    } catch (error) {
        handleError(error, "userService", "getCurrentUser")
    }
}

export default {
    createUser,
    updateUser,
    allUsers,
    getUser,
    deleteUser,
    getCurrentUser
}