import { prismaClientInstance as prisma } from "../config/database.js"

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
        include: { role: true }
    });
};

export default {
    findByUsername,
    findById
}