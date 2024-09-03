import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException, NotFoundException } from "../utils/customException.js";

const findById = async (id) => {
    return await prisma.team.findUnique({
        where: {
            id: id
        }
    })
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
                head: {
                    connect: {
                        id: head_id
                    }
                }
            }
        })
    } else {
        throw new BadRequestException({
            msg: "Team name must be unique"
        })
    }
}

const updateById = async (id, data) => {
    let team = await findById(id)
    if (!team)
        throw new NotFoundException({
            msg: "Team doesn't exist"
        })
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
    create,
    updateById,
    deleteById
}