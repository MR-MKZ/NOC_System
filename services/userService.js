import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import userModel from "../models/userModel.js"
import * as yup from "yup";
import { BadRequestException, NotFoundException, ServerException } from "../utils/customException.js";
import hashPassword from "../utils/passwordHash.js";
import convertRole from "../utils/convertRole.js";

const userSchema = yup.object().shape({
    username: yup.string().trim().required("Username is required"),
    password: yup.string().min(8).trim().required("Password is required"),
    email: yup.string().email().required("Email is required"),
    role: yup.string().oneOf(["Team_724", "Head", "Member"], "User role should be one of this options: Team_724, Head, Member").required("User role is required")
})

const updateUserSchema = yup.object().shape({
    username: yup.string().trim(),
    password: yup.string().min(8).trim(),
    email: yup.string().email(),
    role: yup.string().oneOf(["Team_724", "Head", "Member"], "User role should be one of this options: Team_724, Head, Member")
})

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
        } else if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        } else {
            throw new ServerException({
                msg: "Internal server error, please try again later.",
                data: {
                    meta: {
                        location: 'teamService',
                        operation: 'createUser',
                        time: new Date().toLocaleTimeString(),
                        date: new Date().toLocaleDateString()
                    }
                }
            })
        }
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

        if (username)
            updatedData.username = username

        if (password)
            updatedData.password = password

        if (email)
            updatedData.email = email

        if (role)
            updatedData.role = role

        let validatedData = await updateUserSchema.validate(updatedData)
        
        if (password)
            updatedData.password = hashPassword(password)
        
        if (role)
            updatedData.role = convertRole(role)

        return await userModel.updateById({
            id: userId,
            updatedData: validatedData
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: error.errors
            })
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundException({
                    msg: "User not found"
                })
            }
        } else if (error instanceof PrismaClientValidationError) {
            console.log(error.message);
            
            throw new BadRequestException({
                msg: error.message
            })
        } else {
            console.log(error);
            throw new ServerException({
                msg: "Internal server error, please try again later."
            })
        }
    }
}

const allUsers = async (skip, take) => {
    try {
        return await userModel.all(skip, take);
    } catch (error) {
        console.log(error);
        throw new ServerException({
            msg: 'Internal server error, please try again later.',
            data: {
                meta: {
                    location: 'userService',
                    operation: 'allUsers',
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                }
            }
        })
    }
}

export default {
    createUser,
    updateUser,
    allUsers
}