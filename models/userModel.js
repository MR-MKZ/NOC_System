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
            },
            team: {
                select: {
                    id: true,
                    name: true,
                    head: true,
                    alert_pack: true
                }
            }
        }
    });
};

const all = async (skip, take) => {
    let users = await prisma.user.findMany({
        where: {
            NOT: [
                { role_id: 1 }
            ]
        },
        include: {
            role: {
                select: {
                    id: true,
                    name: true
                }
            },
            team: {
                select: {
                    head: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    id: true,
                    name: true
                }
            }
        },
        skip: skip,
        take: take
    })

    let usersCount = await prisma.user.count({
        where: {
            NOT: [{
                role_id: 1
            }]
        }
    })

    return users ? {
        total: usersCount,
        users: users
    } : undefined
}

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

const addTeam = async (id, team) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            team_id: team
        }
    })
}

export default {
    findByUsername,
    findById,
    all,
    addUser,
    deleteById,
    updateById,
    addTeam
}