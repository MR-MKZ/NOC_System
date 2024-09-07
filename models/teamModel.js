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
    let teams = await prisma.team.findMany({
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
        },
        skip: skip,
        take: take
    })

    let teamCount = await prisma.team.count()

    return teams ? {
        total: teamCount,
        teams: teams
    } : undefined
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