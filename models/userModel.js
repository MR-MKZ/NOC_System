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
        where: { username }, 
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
            },
            alert_pack: {
                select: {
                    id: true,
                    type: true,
                    status: true,
                    priority: true,
                    fingerprint: true
                }
            }
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
            },
            alert_pack: {
                select: {
                    id: true,
                    type: true,
                    status: true,
                    priority: true,
                    fingerprint: true
                }
            }
        }
    });
};

const findUsers = async (users) => {
    return await prisma.user.findMany({
        where: {
            id: {
                in: users
            }
        },
        // include: {
        //     alert_pack: true,
        //     role: true,
        //     team: true
        // },
        select: {
            id: true,
            username: true,
            role_id: true,
            role: true,
            team_id: true,
            team: true,
            alert_pack: true,
            email: true,
        }
    })
}

const all = async (role, team) => {
    let users;
    let usersCount;
    let query = {
        where: {},
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
            },
            alert_pack: {
                select: {
                    id: true,
                    type: true,
                    status: true,
                    priority: true,
                    fingerprint: true
                }
            }
        }
    }

    if (role) {
        query["where"]["role"] = {
            name: role
        }
    }

    if (team) {
        query["where"]["team"] = {
            name: team
        }
    }

    if (!role) {
        query["where"]["NOT"] = [
            { role_id: 1 }
        ]
    }

    usersCount = await prisma.user.count({
        where: query["where"]
    })

    users = await prisma.user.findMany(query)    

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

const removeTeam = async (id, teamId) => {
    return await prisma.user.update({
        where: {
            id: id,
            team_id: teamId
        },
        data: {
            team: {
                disconnect: true
            }
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
    addTeam,
    removeTeam,
    findUsers
}