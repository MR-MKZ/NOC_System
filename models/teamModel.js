import { prismaClientInstance as prisma } from "../config/database.js";

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
    return await prisma.team.create({
        data: {
            name: name,
            head_id: head_id
        }
    })
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
    create,
    updateById,
    deleteById
}