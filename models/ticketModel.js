const { Prisma } = require('@prisma/client');
const prisma = require('../config/database');

exports.createTicket = async (data) => {
    try {
        return await prisma.ticket.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                // MVP1 : Default 
                priorityId: Number(data.priority),
                assignedTo: 2,
                categoryId: data.categoryId,
                createdBy: data.createdBy,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            const fieldNameRaw = error.meta.field_name || 'unknown field';
            const fieldNameMatch = fieldNameRaw.match(/^[^_]+_[^_]+/);
            const fieldName = fieldNameMatch ? fieldNameMatch[0] : (fieldNameRaw || 'unknown field');
            return {
                message: 'Error creating ticket (Foreign key)',
                error: `Foreign key constraint failed: Invalid ${fieldName}`
            };
        }
        return {
            message: 'Error creating ticket',
            error: error.message
        };
    }
};

exports.getTicketById = async (ticketId) => {
    try {
        return await prisma.ticket.findUnique({
            where: { id: Number(ticketId) },
        });
    } catch (error) {
        return { error: 'Internal error' };
    }
};

exports.closeTicket = async (ticketId) => {
    try {
        return await prisma.ticket.update({
            where: { id: Number(ticketId) },
            data: { status: 'completed' },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return {
                message: 'Error closing ticket',
                error: 'Ticket not found'
            };
        }
        return {
            message: 'Error closing ticket',
            error: error.message
        };
    }
};

exports.changeTicketStatus = async (ticketId, status) => {
    try {
        return await prisma.ticket.update({
            where: { id: Number(ticketId) },
            data: { status },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { message: 'Ticket not found' };
        }
        return { message: 'Error changing status', error: error.message };
    }
};

exports.updateTicket = async (ticketId, data) => {
    try {
        return await prisma.ticket.update({
            where: { id: Number(ticketId) },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priorityId: data.priorityId,
                categoryId: data.categoryId,
                assignedTo: data.assignedTo,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return {
                message: 'Error updating ticket',
                error: 'Ticket not found'
            };
        }
        return {
            message: 'Error updating ticket',
            error: error.message
        };
    }
};

exports.getAll = async () => {
    return await prisma.ticket.findMany({
        include: {
            assignee: { select: { name: true } },
            creator: { select: { name: true } },
            priority: true
        }, orderBy: {
            priority: {
                id: 'asc'
            }
        }
    });
};

exports.getByAssign = async (assignId) => {
    return await prisma.ticket.findMany({
        where: { assignedTo: assignId },
        include: {
            assignee: { select: { name: true } },
            creator: { select: { name: true } }, priority: true
        }, orderBy: {
            priority: {
                id: 'asc'
            }
        }
    });
};

exports.getByCreatedBy = async (createdById) => {
    return await prisma.ticket.findMany({
        where: { createdBy: createdById },
        include: {
            assignee: { select: { name: true } },
            creator: { select: { name: true } },
            priority: true
        }, orderBy: {
            priority: {
                id: 'asc'
            }
        }
    });
};

exports.countOpenTicketsByUser = async (userId) => {
    try {

        const count = await prisma.ticket.count({
            where: { createdBy: Number(userId), status: 'pending' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countCloseTicketsByUser = async (userId) => {
    try {

        const count = await prisma.ticket.count({
            where: { createdBy: Number(userId), status: 'completed' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countTotalTicketsByUser = async (userId) => {
    try {

        const count = await prisma.ticket.count({
            where: { createdBy: Number(userId) }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}

exports.countCloseTicketsBySupport = async (userId) => {
    try {
        const count = await prisma.ticket.count({
            where: { assignedTo: Number(userId), status: 'completed' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countOpenTicketsBySupport = async (userId) => {
    try {
        const count = await prisma.ticket.count({
            where: { assignedTo: Number(userId), status: 'pending' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countTotalTicketsBySupport = async (userId) => {
    try {
        const count = await prisma.ticket.count({
            where: { assignedTo: Number(userId) }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countOpenTicketsByAdmin = async (userId) => {
    try {
        const count = await prisma.ticket.count({
            where: { status: 'pending' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countCloseTicketsByAdmin = async (userId) => {
    try {
        const count = await prisma.ticket.count({
            where: { status: 'completed' }
        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.countTotalTicketsByAdmin = async (userId) => {
    try {
        const count = await prisma.ticket.count({

        });
        return count;
    } catch (error) {
        return { error: error.message };
    }
}
exports.getTicketCategories = async () => {
    try {
        const category = await prisma.category.findMany()
        return category;
    } catch (error) {
        return { error: error.message };
    }
}