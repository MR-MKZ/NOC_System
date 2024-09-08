import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException, NotFoundException } from "../utils/customException.js";

const findById = async (id) => {
    return await prisma.team.findUnique({
        where: {
            id: id
        },
        include: {
            members: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    })
}

const all = async (skip, take) => {
    let query = {
        include: {
            head: {
                select: {
                    id: true,
                    username: true
                }
            },
            members: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    }

    if (skip != "off") {
        query["skip"] = skip
        query["take"] = take
    }

    let teams = await prisma.team.findMany(query)

    let teamCount = await prisma.team.count()

    if (skip != "off") {
        return teams ? {
            total: teamCount,
            teams: teams
        } : undefined
    } else {
        return teams
    }
}

const create = async ({
    name,
    head_id
}) => {
    let team = await prisma.team.findUnique({
        where: {
            name: name
        }
    })
    if (!team) {
        return await prisma.team.create({
            data: {
                name: name,
                head_id: head_id
            }
        })
    } else {
        throw new BadRequestException({
            msg: "Team name must be unique"
        })
    }
}

const updateById = async (id, data) => {
    return await prisma.team.update({
        where: {
            id: id
        },
        data: data
    })
}

const deleteById = async (id) => {
    return await prisma.team.delete({
        where: {
            id: id
        }
    })
}

export default {
    findById,
    all,
    create,
    updateById,
    deleteById
}