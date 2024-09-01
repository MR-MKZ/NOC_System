import { prismaClientInstance as prisma } from "../config/database.js";
import convertRole from "../utils/convertRole.js";
import hashPassword from "../utils/passwordHash.js";

/**
 * @typedef {Object} User
 * @property {string} username - The unique username of user.
 * @property {string} password - The password of user.
 * @property {string} email - The email of user.
 * @property {'Admin' | 'Team_724' | 'Head' | 'Member'} role - The role of user.
 */

const findByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username }, include: {
            role: true
        }
    });
};

const findById = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: {
                select: {
                    name: true
                }
            }
        }
    });
};

/**
 * 
 * @param {User} userData
 * @returns 
 */
const addUser = async ({
    username,
    password,
    email,
    role
}) => {
    return await prisma.user.create({
        data: {
            username: username,
            password: hashPassword(password),
            email: email,
            role_id: convertRole(role)
        }
    })
}

const deleteById = async (userId) => {
    return await prisma.user.delete({
        where: {
            id: userId
        }
    })
}

const updateById = async ({
    id,
    updatedData
}) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: updatedData
    })
}

export default {
    findByUsername,
    findById,
    addUser,
    deleteById,
    updateById
}